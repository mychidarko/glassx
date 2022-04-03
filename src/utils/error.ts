export class HooksUnsupportedError extends Error {
  constructor() {
    super();
    this.message =
      'The installed version of React does not support Context. ' +
      'Upgrade to React v16.3.0 or later.';
    this.name = 'ReactHooksUnsupportedError';
  }
}
