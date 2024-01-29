import { usePageData } from '../../runtime';
import 'uno.css';
import '../style/base.css';
import '../style/vars.css';
import '../style/doc.css';
import { Nav } from './components/Nav';
import { HomeLayout } from './HomeLayout';
import { DocLayout } from './DocLayout';

export function Layout() {
  const pageData = usePageData();

  const { pageType } = pageData;
  // debugger
  const getContent = () => {
    if (pageType === 'doc') {
      return <DocLayout />;
    } else if (pageType === 'home') {
      return <HomeLayout />;
    }

    return <div>404页面</div>;
  };

  return (
    <div>
      {/* <h1>This is Layout Component1assss</h1> */}
      <Nav />
      <section style={{ paddingTop: 'var(--island-nav-height)' }}>
        {getContent()}
      </section>
    </div>
  );
}
