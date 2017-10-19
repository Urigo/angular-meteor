import { AppPage } from './app.po';

describe('angularcli-meteor App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });

  it('should load chats from them Meteor backend', () => {
    const chats = '[ { "title": "Ethan Gonzalez", "picture": "https://randomuser.me/api/portraits/thumb/men/1.jpg", "_id": "YHiPouKHn33TfvJ4N" }, { "title": "Bryan Wallace", "picture": "https://randomuser.me/api/portraits/thumb/lego/1.jpg", "_id": "QoPA22itTNmux82cj" }, { "title": "Avery Stewart", "picture": "https://randomuser.me/api/portraits/thumb/women/1.jpg", "_id": "4zN8GZc7cr68PibaD" }, { "title": "Katie Peterson", "picture": "https://randomuser.me/api/portraits/thumb/women/2.jpg", "_id": "yEroDzg5wCbdgDXFJ" }, { "title": "Ray Edwards", "picture": "https://randomuser.me/api/portraits/thumb/men/2.jpg", "_id": "pWJXJHhhrDxiyczrF" } ]';
    page.navigateTo();
    expect(page.getLastDiv()).toEqual(chats);
  });
});
