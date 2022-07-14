import { InternationalNumberPipe } from './international-number.pipe';

describe('InternationalNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new InternationalNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
