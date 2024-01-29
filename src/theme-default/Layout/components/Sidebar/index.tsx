import { SideBarGroup, SideBarItem } from 'shared';
import styles from './index.module.scss';
import { Link } from '../Link';

interface SidebarProps {
  sidebarData: SideBarGroup[];
  pathname: string;
}

export function Sidebar(props: SidebarProps) {
  const { sidebarData, pathname } = props;

  const renderGroupItem = (item: SideBarItem) => {
    const active = item.link === pathname;
    return (
      <div ml="1" not-first="divider-top mt-4">
        <div
          p="1"
          text="sm"
          font-medium="~"
          block="~"
          className={`${active ? 'text-brand' : 'text-text-2'}`}
        >
          <Link href={item.link}>{item.text}</Link>
        </div>
      </div>
    );
  };

  const renderGroup = (item: SideBarGroup) => {
    return (
      <section key={item.text} block="~">
        <div flex="~" items="center" justify="between">
          <h2 m="t-3 b-2" text="1rem text-1" font="bold">
            {item.text}
          </h2>
        </div>

        <div mb="1">
          {item.items?.map((item) => {
            return <div key={item.link}>{renderGroupItem(item)}</div>;
          })}
        </div>
      </section>
    );
  };

  return (
    <aside className={styles.sidebar}>
      <nav>{sidebarData.map(renderGroup)}</nav>
    </aside>
  );
}
