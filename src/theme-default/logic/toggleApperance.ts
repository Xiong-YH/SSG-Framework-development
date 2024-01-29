const APPERANCE_KEY = 'apperance';

function updateApperance() {
  const updatePrefrence = localStorage.getItem(APPERANCE_KEY);
  setClassList(updatePrefrence === 'dark');
}

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  updateApperance();
  //tab页面之间同步
  window.addEventListener('storage', updateApperance);
}

function setClassList(isDark = false) {
  const classList = document.documentElement.classList;

  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
}

export function toggle() {
  const classList = document.documentElement.classList;

  if (classList.contains('dark')) {
    setClassList(false);
    //本地储存
    localStorage.setItem(APPERANCE_KEY, 'light');
  } else {
    setClassList(true);

    localStorage.setItem(APPERANCE_KEY, 'dark');
  }
}
