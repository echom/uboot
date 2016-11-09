/* eslint-disable no-extend-native */
class JSDocSymbol {
  constructor(symbol) {
    this._symbol = symbol;
  }

  get kind() { return this._symbol.kind; }
  get name() { return this._symbol.name; }
  get longname() { return this._symbol.longname; }
  get memberof() { return this._symbol.memberof; }
  get scope() { return this._symbol.scope; }
  get description() { return this._symbol.description; }
  get meta() { return this._symbol.meta; }
  get comment() { return this._symbol.comment; }
  get readonly() { return this._symbol.readonly; }
  get classdesc() { return this._symbol.classdesc; }
  get type() { return this._symbol.type; }
  get inherited() { return this._symbol.inherited; }
  get inherits() { return this._symbol.inherits; }

  get access() { return this._symbol.access || 'public'; }

  get augments() {
    return (this._symbol.augments && this._symbol.augments.length) ?
      this._symbol.augments :
      undefined;
  }
  get params() {
    return (this._symbol.params && this._symbol.params.length) ?
      this._symbol.params :
      undefined;
  }
  get returns() {
    return (this._symbol.returns && this._symbol.returns.length) ?
      this._symbol.returns :
      undefined;
  }
  get exceptions() {
    return (this._symbol.exceptions && this._symbol.exceptions.length) ?
      this._symbol.exceptions :
      undefined;
  }
  get properties() {
    return (this._symbol.properties && this._symbol.properties.length) ?
      this._symbol.properties :
      undefined;
  }

  get toplevel() {
    var kind = this.kind;
    return (
      kind === 'namespace' ||
      kind === 'class' ||
      kind === 'interface' ||
      kind === 'enum'
    ) && this.scope !== 'inner';
  }
  get callable() {
    var kind = this.kind;
    return (
      kind === 'class' ||
      kind === 'function' ||
      (kind === 'typedef' && (this.type && this.type.names[0] === 'function'))
    );
  }

  get member() {
    return (
      this.kind === 'member' ||
      this.kind === 'function' ||
      this.kind === 'event' ||
      this.kind === 'property'
    );
  }

  get modifiers() {
    var modifiers = this.access + ' ';
    if (this.member) {
      modifiers += this.scope === 'static' ? 'static ' : '';
      modifiers += this.readonly ? 'readonly ' : '';
      modifiers += this.constant ? 'constant' : '';
    }
    return modifiers;
  }

  get prefix() {
    return this.longname.substr(0, (this.longname.length - this.name.length));
  }

  get signature() {
    var signature;
    if (this.callable) {
      if (!this._signature) {
        signature = '(';
        if (this.params) {
          signature += this.params.map(function(p) {
            return p.name;
          }).join(', ');
        }
        this._signature = signature + ')';
      }

      return this._signature;
    } else {
      return ' ';
    }
  }

  get longsignature() {
    var signature;
    if (this.callable) {
      if (!this._longsignature) {
        signature = '(';
        if (this.params) {
          signature += this.params.map(function(p) {
            return (
              (p.optional ? '[' : '') +
              p.name +
              ':' + (p.type ? p.type.names.join('|') : '*') +
              (p.optional ? ']' : '')
            );
          }).join(', ');
        }
        signature += ')';

        if (this.returns && this.returns[0].type) {
          signature += ' : ' + this.returns[0].type.names.join('|');
        } else if (this.kind === 'function' || this.kind === 'typedef') {
          signature += ' : void';
        }

        this._longsignature = signature;
      }

      return this._longsignature;
    } else if (this.kind === 'member') {
      return ': ' + (this.type && this.type.names ? this.type.names.join('|') : '*');
    } else {
      return ' ';
    }
  }

  get id() {
    if (!this._id) {
      this._id = this.longname
              .replace(/#/g, ':')
              .replace(/[^a-zA-Z\d:-]/g, '_');
    }
    return this._id;
  }
}


function process(symbolData, data, onEnterSymbol, onExitSymbol) {
  var symbol = new JSDocSymbol(symbolData),
      recurse = function(s) { process(s, data, onEnterSymbol, onExitSymbol); };

  if (onEnterSymbol) {
    onEnterSymbol(symbol);
  }

  data({ memberof: symbol.longname, kind: 'member' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'function' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'event' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'namespace' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'enum' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'class' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'interface' }).each(recurse);
  data({ memberof: symbol.longname, kind: 'typedef' }).each(recurse);

  if (onExitSymbol) {
    onExitSymbol(symbol);
  }
}


module.exports = function(data, onSymbol, opts) {
  var _opts = opts || {};

  onSymbol(data({ kind: 'package' }).first());

  // prepare data
  if (!_opts.undocumented) { data({ undocumented: true }).remove(); }
  if (!_opts.ignored) { data({ ignore: true }).remove(); }
  if (!_opts.private) { data({ access: 'private' }).remove(); }
  if (!_opts.protected) { data({ access: 'protected' }).remove(); }

  // transform @enum to kind:enum
  data({ kind: 'member', isEnum: true }).each(function(symbol) { symbol.kind = 'enum'; });

  // filter the root symbols (except 'package' which is a built in symbol)
  // and process
  data(function() {
    return !('memberof' in this) && this.kind !== 'package';
  }).get().forEach(function(symbol) { process(symbol, data, onSymbol); });
};
