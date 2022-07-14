export class CurrencyUtils {
  static format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split('.');
    return (
      parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, ',') +
      (!parts[1] ? '' : '.' + parts[1])
    );
  }

  static unFormat(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '');

    return val.replace(/,/g, '');
  }
}
