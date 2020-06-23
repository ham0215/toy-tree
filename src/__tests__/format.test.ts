const { format } = require('../format');

describe('format', () => {
  test('only root', () => {
    expect(
      format({
        type: 'directory',
        name: 'root',
        children: [],
      }),
    ).toMatchSnapshot();
  });
});