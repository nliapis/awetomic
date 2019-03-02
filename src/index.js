function fetchDocumentValue(key = '') {
  return {
    [key]: document[key],
  };
}

class Awetomic {
  static get location() {
    return fetchDocumentValue('location');
  }

  static get referrer() {
    return fetchDocumentValue('referrer');
  }
}

window.Awetomic = Awetomic;
