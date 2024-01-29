import { Content, usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import styles from './index.module.scss';
import { DocFooter } from '../components/DocFooter';
import { Aside } from '../components/Aside';

export function DocLayout() {
  const { siteData, toc } = usePageData();

  //得到配置信息
  const sitebar = siteData.themeConfig?.sidebar || {};
  //得到当前路由路径
  const { pathname } = useLocation();
  //进行路由匹配
  const matchSidebarKey = Object.keys(sitebar).find((key) => {
    //一定是路径部分匹配路由
    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchSidebar = sitebar[matchSidebarKey] || [];

  return (
    <div>
      {/* 侧边栏 */}
      <Sidebar sidebarData={matchSidebar} pathname={pathname} />
      <div className={styles.content} flex="~">
        <div className={styles.docContent}>
          <div className="island-doc">
            {/* 正文内容 */}
            <Content />
          </div>
          {/* 页脚 */}
          <DocFooter />
        </div>
        {/* 右侧边栏 */}
        <div className={styles.asideContainer}>
          <Aside headers={toc} __island />
        </div>
      </div>
    </div>
  );
}
