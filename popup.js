async function getCurrentTab() {
  const window = await chrome.windows.getCurrent();
  console.log(window);
  const queryOptions = { active: true, windowId: window.id };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const localhostURL = new URL("http://localhost:80");

const input = document.querySelector("input[type='text']");
input.value = window.localStorage.getItem("port") ?? 80;
localhostURL.port = input.value;
input.onchange = () => {
  window.localStorage.setItem("port", input.value);
  localhostURL.port = input.value;
};

const button = document.querySelector("button");
const checkbox = document.querySelector("input[type='checkbox']");
button.onclick = async () => {
  const tab = await getCurrentTab();
  console.log(tab);
  const url = new URL(tab.url);
  localhostURL.pathname = url.pathname;
  localhostURL.search = url.search;
  const finalUrl = localhostURL.toString();
  if (checkbox.checked) {
    chrome.tabs.create({ url: finalUrl });
  } else {
    chrome.tabs.update(tab.id, { url: finalUrl });
  }
};
