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

  it('should load chats from the Meteor backend', () => {
    page.navigateTo();
    expect(page.getLastDiv()).toContain('Ethan Gonzalez');
    expect(page.getLastDiv()).toContain('Bryan Wallace');
    expect(page.getLastDiv()).toContain('Avery Stewart');
    expect(page.getLastDiv()).toContain('Katie Peterson');
    expect(page.getLastDiv()).toContain('Ray Edwards');
  });
});
