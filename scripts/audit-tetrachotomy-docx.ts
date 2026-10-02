import { inflateRawSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { TETRACHOTOMY_FORMULAS } from '../src/data/tetrachotomies';
import type { TetrachotomyFormulaRecord, TetrachotomySourceFormulaRow } from '../src/data/tetrachotomies';
import type { AspectId } from '../src/data/socionics';
import type { SocionicTypeId } from '../src/data/types';

interface ZipEntry {
  compression: number;
  compressedSize: number;
  fileName: string;
  localHeaderOffset: number;
}

interface DocxSourceRow {
  aspectIds: readonly AspectId[];
  aspectText: string;
  aspectFeaturesText: string;
  functionBlockLabel: string;
  functionIds: readonly number[];
  functionFeaturesText: string;
}

interface DocxSourceBlock {
  formulaId: string | null;
  typeIds: readonly SocionicTypeId[];
  labels: readonly string[];
  rows: DocxSourceRow[];
}

const CWD = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(CWD, '..');
const DEFAULT_DOCX_PATH = path.join(REPO_ROOT, 'harness', 'theory', 'tetrachotomy-source.docx');

const TYPE_ID_BY_SOURCE_TEXT = {
  'ИЛЭ': 'ILE',
  'СЭИ': 'SEI',
  'ЭСЭ': 'ESE',
  'ЛИИ': 'LII',
  'ЭИЭ': 'EIE',
  'ЛСИ': 'LSI',
  'СЛЭ': 'SLE',
  'ИЭИ': 'IEI',
  'ЛИЭ': 'LIE',
  'ЭСИ': 'ESI',
  'СЭЭ': 'SEE',
  'ИЛИ': 'ILI',
  'ЛСЭ': 'LSE',
  'ЭИИ': 'EII',
  'ИЭЭ': 'IEE',
  'СЛИ': 'SLI',
} as const satisfies Record<string, SocionicTypeId>;

const ASPECT_ID_BY_SOURCE_TEXT = {
  'ЧИ': 'Ne',
  'БС': 'Si',
  'ЧЭ': 'Fe',
  'БЛ': 'Ti',
  'ЧЛ': 'Te',
  'БЭ': 'Fi',
  'ЧС': 'Se',
  'БИ': 'Ni',
} as const satisfies Record<string, AspectId>;

const TYPE_TOKEN_PATTERN = Object.keys(TYPE_ID_BY_SOURCE_TEXT).join('|');
const SOURCE_GROUP_RE = new RegExp(`(?:^|—)\\s*((?:${TYPE_TOKEN_PATTERN})(?:\\s+(?:${TYPE_TOKEN_PATTERN})){3})\\s*—?`, 'u');
const FORMULA_ID_RE = /^(?:Верт|Бс\/Пр|Ит\/Сн|Дм\/Ар|\+\/-|Ус\/Уп|Лг\/Эт)\s*=.+\((\d+)\s*,\s*[аaсc]\)\s*$/iu;
const ROW_RE = /\[([^\]|~>]+?)\s*\|\s*([^\]]*?)\]\s*→\s*\(([^)]*?)\)/gu;

const readUInt16 = (buffer: Buffer, offset: number): number => buffer.readUInt16LE(offset);
const readUInt32 = (buffer: Buffer, offset: number): number => buffer.readUInt32LE(offset);

function xmlUnescape(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function readDocxXml(docxPath: string, targetFileName: string): string {
  const buffer = readFileSync(docxPath);
  const eocdSignature = 0x06054b50;
  let eocdOffset = -1;

  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 0xffff - 22); offset -= 1) {
    if (readUInt32(buffer, offset) === eocdSignature) {
      eocdOffset = offset;
      break;
    }
  }

  if (eocdOffset < 0) {
    throw new Error(`Cannot find DOCX central directory: ${docxPath}`);
  }

  const centralDirectorySize = readUInt32(buffer, eocdOffset + 12);
  const centralDirectoryOffset = readUInt32(buffer, eocdOffset + 16);
  const entries: ZipEntry[] = [];
  let offset = centralDirectoryOffset;

  while (offset < centralDirectoryOffset + centralDirectorySize) {
    if (readUInt32(buffer, offset) !== 0x02014b50) {
      throw new Error(`Invalid DOCX central directory at offset ${offset}`);
    }

    const compression = readUInt16(buffer, offset + 10);
    const compressedSize = readUInt32(buffer, offset + 20);
    const fileNameLength = readUInt16(buffer, offset + 28);
    const extraLength = readUInt16(buffer, offset + 30);
    const commentLength = readUInt16(buffer, offset + 32);
    const localHeaderOffset = readUInt32(buffer, offset + 42);
    const fileName = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString('utf8');

    entries.push({
      compression,
      compressedSize,
      fileName,
      localHeaderOffset,
    });

    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  const entry = entries.find(candidate => candidate.fileName === targetFileName);
  if (!entry) {
    throw new Error(`Cannot find ${targetFileName} in ${docxPath}`);
  }

  const localOffset = entry.localHeaderOffset;
  if (readUInt32(buffer, localOffset) !== 0x04034b50) {
    throw new Error(`Invalid DOCX local file header for ${targetFileName}`);
  }

  const localFileNameLength = readUInt16(buffer, localOffset + 26);
  const localExtraLength = readUInt16(buffer, localOffset + 28);
  const dataStart = localOffset + 30 + localFileNameLength + localExtraLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.compression === 0) {
    return compressed.toString('utf8');
  }

  if (entry.compression === 8) {
    return inflateRawSync(compressed).toString('utf8');
  }

  throw new Error(`Unsupported DOCX compression method ${entry.compression} for ${targetFileName}`);
}

function extractParagraphs(xml: string): readonly string[] {
  const paragraphs = [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/gu)].map(match => {
    const textRuns = [...match[0].matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/gu)]
      .map(textMatch => xmlUnescape(textMatch[1]));

    return textRuns.join('').replace(/\s+/gu, ' ').trim();
  });

  return paragraphs.filter(paragraph => paragraph.length > 0);
}

function sortedSetKey(typeIds: readonly SocionicTypeId[]): string {
  return [...typeIds].sort().join('|');
}

function rowSignature(row: Pick<TetrachotomySourceFormulaRow, 'aspectText' | 'aspectFeaturesText' | 'functionBlockLabel' | 'functionIds' | 'functionFeaturesText'>): string {
  return [
    row.aspectText,
    row.aspectFeaturesText,
    row.functionBlockLabel,
    row.functionIds.join(' '),
    row.functionFeaturesText,
  ].join(' -> ');
}

function normalizeLabels(rawLabelText: string): readonly string[] {
  const labelText = rawLabelText
    .replace(/\[[\s\S]*$/u, '')
    .replace(/^[-—\s]+|[-—\s]+$/gu, '')
    .trim();

  if (!labelText || /^Формула/u.test(labelText)) {
    return [];
  }

  return labelText
    .split(/—/u)
    .map(label => label.trim())
    .filter(label => label.length > 0 && !/^Формула/u.test(label));
}

function parseFormulaId(paragraph: string, currentFormulaId: string | null): string | null {
  const formulaMatch = paragraph.match(FORMULA_ID_RE);
  if (!formulaMatch) {
    return currentFormulaId;
  }

  return `tetra-${formulaMatch[1].padStart(2, '0')}`;
}

function parseGroup(paragraph: string): { typeIds: readonly SocionicTypeId[]; labels: readonly string[] } | null {
  const groupMatch = paragraph.match(SOURCE_GROUP_RE);
  if (!groupMatch || groupMatch.index === undefined) {
    return null;
  }

  const typeIds = groupMatch[1]
    .split(/\s+/u)
    .map(typeName => TYPE_ID_BY_SOURCE_TEXT[typeName as keyof typeof TYPE_ID_BY_SOURCE_TEXT]);
  const afterGroup = paragraph.slice(groupMatch.index + groupMatch[0].length);

  return {
    typeIds,
    labels: normalizeLabels(afterGroup),
  };
}

function parseRows(paragraph: string): readonly DocxSourceRow[] {
  return [...paragraph.matchAll(ROW_RE)].flatMap(match => {
    const [rawRow, aspectTextRaw, aspectFeaturesTextRaw, functionTextRaw] = match;
    if (rawRow.includes('~') || rawRow.includes('>')) {
      return [];
    }

    const functionParts = functionTextRaw.split('|').map(part => part.trim());
    if (functionParts.length < 2 || functionParts.length > 3) {
      return [];
    }

    const [functionBlockLabel, functionIdsText, functionFeaturesText] = functionParts.length === 3
      ? functionParts
      : ['', functionParts[0], functionParts[1]];
    const functionIds = functionIdsText
      .split(/\s+/u)
      .filter(Boolean)
      .map(Number)
      .filter(functionId => Number.isInteger(functionId));
    const aspectText = aspectTextRaw.trim().replace(/\s+/gu, ' ');
    const aspectIds = aspectText
      .split(/\s+/u)
      .map(aspectName => ASPECT_ID_BY_SOURCE_TEXT[aspectName as keyof typeof ASPECT_ID_BY_SOURCE_TEXT]);

    if (functionIds.length === 0 || aspectIds.some(aspectId => !aspectId)) {
      return [];
    }

    return [{
      aspectIds,
      aspectText,
      aspectFeaturesText: aspectFeaturesTextRaw.trim(),
      functionBlockLabel,
      functionIds,
      functionFeaturesText,
    }];
  });
}

export function extractDirectTetrachotomySourceBlocks(docxPath = DEFAULT_DOCX_PATH): readonly DocxSourceBlock[] {
  const xml = readDocxXml(docxPath, 'word/document.xml');
  const paragraphs = extractParagraphs(xml);
  const blocks: DocxSourceBlock[] = [];
  let currentFormulaId: string | null = null;
  let currentBlock: DocxSourceBlock | null = null;

  paragraphs.forEach(paragraph => {
    currentFormulaId = parseFormulaId(paragraph, currentFormulaId);

    const parsedGroup = parseGroup(paragraph);
    if (parsedGroup) {
      currentBlock = {
        formulaId: currentFormulaId,
        typeIds: parsedGroup.typeIds,
        labels: parsedGroup.labels,
        rows: [],
      };
      blocks.push(currentBlock);
    }

    const rows = parseRows(paragraph);
    if (rows.length > 0 && currentBlock) {
      currentBlock.rows.push(...rows);
    }
  });

  return blocks.filter(block => block.rows.length > 0);
}

export function auditCurrentSourceBlocks(docxBlocks: readonly DocxSourceBlock[]): readonly string[] {
  const lines: string[] = [];
  const blocksByFormulaAndTypes = new Map<string, DocxSourceBlock[]>();

  docxBlocks.forEach(block => {
    const typesKey = sortedSetKey(block.typeIds);
    const scopedKey = `${block.formulaId ?? 'unknown'}:${typesKey}`;

    blocksByFormulaAndTypes.set(scopedKey, [...(blocksByFormulaAndTypes.get(scopedKey) ?? []), block]);
  });

  const formulasWithSourceBlocks = TETRACHOTOMY_FORMULAS.filter(formula => formula.sourceBlocks);
  const formulasWithoutSourceBlocks = TETRACHOTOMY_FORMULAS.filter(formula => !formula.sourceBlocks);

  lines.push(`DOCX direct source blocks: ${docxBlocks.length}`);
  lines.push(`Current formulas with sourceBlocks: ${formulasWithSourceBlocks.map(formula => formula.id).join(', ')}`);
  lines.push(`Current formulas without sourceBlocks: ${formulasWithoutSourceBlocks.length}`);
  lines.push('');

  formulasWithSourceBlocks.forEach(formula => {
    const missingGroups: string[] = [];
    const rowMismatches: string[] = [];
    const sourceBlocks = formula.sourceBlocks ?? [];

    sourceBlocks.forEach(block => {
      const typesKey = sortedSetKey(block.typeIds);
      const docxCandidates = blocksByFormulaAndTypes.get(`${formula.id}:${typesKey}`)
        ?? [];

      if (docxCandidates.length === 0) {
        missingGroups.push(typesKey);
        return;
      }

      const currentRows = new Set(block.rows.map(rowSignature));
      const hasExactRows = docxCandidates.some(candidate => {
        const candidateRows = new Set(candidate.rows.map(rowSignature));

        return currentRows.size === candidateRows.size
          && [...currentRows].every(signature => candidateRows.has(signature));
      });

      if (!hasExactRows) {
        rowMismatches.push(typesKey);
      }
    });

    const groupKeys = sourceBlocks.map(block => sortedSetKey(block.typeIds)).sort();
    const extractGroupKeys = formula.groups.map(group => sortedSetKey(group.typeIds)).sort();
    const groupAlignment = JSON.stringify(groupKeys) === JSON.stringify(extractGroupKeys)
      ? 'groups-ok'
      : 'groups-mismatch';
    const docxAlignment = missingGroups.length === 0 && rowMismatches.length === 0
      ? 'docx-ok'
      : `docx-mismatch missing=${missingGroups.length} rows=${rowMismatches.length}`;

    lines.push(`${formula.id}: ${groupAlignment}; ${docxAlignment}; blocks=${sourceBlocks.length}`);
    if (missingGroups.length > 0) {
      lines.push(`  missing DOCX groups: ${missingGroups.join('; ')}`);
    }
    if (rowMismatches.length > 0) {
      lines.push(`  row mismatches: ${rowMismatches.join('; ')}`);
    }
  });

  lines.push('');
  ['tetra-07', 'tetra-13'].forEach(formulaId => {
    const formula = TETRACHOTOMY_FORMULAS.find(candidate => candidate.id === formulaId) as TetrachotomyFormulaRecord | undefined;
    if (!formula) {
      return;
    }

    const extractKeys = formula.groups.map(group => sortedSetKey(group.typeIds));
    const docxKeys = docxBlocks
      .filter(block => block.formulaId === formulaId)
      .map(block => sortedSetKey(block.typeIds));
    const missingInDocx = extractKeys.filter(key => !docxKeys.includes(key));
    const extraInDocx = docxKeys.filter(key => !extractKeys.includes(key));

    lines.push(`${formulaId}: sourceBlocks=${formula.sourceBlocks ? 'present' : 'fallback'}; extract-vs-docx direct groups`);
    lines.push(`  missing in DOCX direct rows: ${missingInDocx.join('; ') || 'none'}`);
    lines.push(`  extra DOCX direct rows: ${extraInDocx.join('; ') || 'none'}`);
  });

  return lines;
}

function main(): void {
  const docxPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_DOCX_PATH;
  const docxBlocks = extractDirectTetrachotomySourceBlocks(docxPath);

  console.log(auditCurrentSourceBlocks(docxBlocks).join('\n'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
