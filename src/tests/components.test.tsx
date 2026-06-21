import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { GameProvider } from '../state/GameContext';

function renderApp() {
  return render(
    <GameProvider>
      <App />
    </GameProvider>,
  );
}

describe('app flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the premise on the home page', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: '取经路线非官方注释' })).toBeInTheDocument();
    expect(screen.getByText(/唐僧师徒已经抵达灵山/)).toBeInTheDocument();
    expect(screen.getByText(/你不是取经人，而是临时档案员/)).toBeInTheDocument();
    expect(screen.getByText(/英雄已经走过，路边的人还在等一个位置/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始整理' })).toBeInTheDocument();
  });

  it('renders onboarding, route slider, and blocks future jump nodes', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: '开始整理' }));
    expect(screen.getByRole('region', { name: '新任档案员交接单' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /跳转到第 \d+ 站/ })).not.toBeInTheDocument();
    expect(screen.getByRole('slider', { name: '滑动查看后续地图节点' })).toBeInTheDocument();
    expect(screen.getByText(/小说路线：墨色实心圆/)).toBeInTheDocument();
    const slider = screen.getByRole('slider', { name: '滑动查看后续地图节点' });
    fireEvent.keyDown(slider, { key: 'End' });
    const futureNode = screen.getByRole('button', { name: /灵山.*未抵达/ });
    expect(futureNode).toBeDisabled();
    await user.click(futureNode);
    expect(screen.getAllByRole('heading', { name: '河州边界 / 双叉岭' }).length).toBeGreaterThan(0);
  });

  it('plays a node scene flow and advances to the next station', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: '开始整理' }));
    await user.click(screen.getByRole('button', { name: '继续整理本站' }));
    await user.click(screen.getByRole('button', { name: '选择本站批注' }));
    await user.click(screen.getAllByRole('button', { name: /^把这条批注放入/ })[0]);
    await user.click(screen.getByRole('button', { name: /接受修改/ }));
    await user.click(screen.getAllByRole('button', { name: /归档为随从二名|保存为未知者|留下空白纪念牌/ })[0]);
    await user.click(screen.getByRole('button', { name: /完成本站，前往五行山/ }));
    expect(screen.getAllByRole('heading', { name: '五行山 / 两界山' }).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: '档案馆' }));
    expect(screen.getByText(/已放置批注/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '河州边界 / 双叉岭' })).toBeInTheDocument();
  });
});
