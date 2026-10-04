import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';
import { Footer } from './Footer';

describe('page chrome', () => {
  it('omits the socionics and algebra badge while preserving the heading', () => {
    const html = renderToString(<Header />);
    expect(html).not.toContain('Соционика');
    expect(html).not.toContain('Алгебра');
    expect(html).toContain('Признаков Рейнина');
  });

  it('shows author attribution without the hexagon', () => {
    const html = renderToString(<Footer />);
    expect(html).toContain('Автор: Сергей Шанэри');
    expect(html).not.toContain('<svg');
    expect(html).toContain('Telegram');
  });
});
