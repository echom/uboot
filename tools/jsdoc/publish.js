/* eslint-disable newline-per-chained-call */

var fs = require('fs-extra'),
    path = require('path'),
    xmlbuilder = require('xmlbuilder'),
    traverse = require('./traverse');

var mode,
    title,
    header,
    index,
    parent;

function fuseTypes(part) {
  return part.type && part.type.names ? part.type.names.join('|') : '*';
}

function hasDetails(symbol) {
  if (symbol.kind == 'function') {
    return true;
  }
  if (symbol.kind == 'class' && (symbol.params || symbol.exceptions)) {
    return true;
  }
  return false;
}

function needsDocs(symbol) {
  if (mode === 'public') {
    return symbol.access === 'public';
  } else if (mode === 'protected') {
    return symbol.access === 'public' || symbol.access === 'protected';
  }

  return true;
}

function indexSymbol(symbol) {
  var icon, title;
  switch (symbol.kind) {
    case 'class': icon = '&nbspf*'; title = 'Constructor'; break;
    case 'enum': icon = '&nbsp;e'; title = 'Enumeration'; break;
    case 'namespace': icon = '{ }'; title = 'Namespace'; break;
    default: icon = '&nbsp;??'; title = 'Unknown Symbol'; break;
  }

  index
    .ele('a')
      .att('class', 'list-group-item')
      .att('href', '#sum-' + symbol.id)
      .ele('span').raw(icon).att('title', title).up()
      .ele('span').raw('&nbsp;').txt(symbol.longname).up();
}

function describeSymbol(symbol) {
  var desc = parent
        .ele('div').att('class', 'symbol-dsc row')
        .ele('div')
          .att('class', 'col-xs-11 col-xs-offset-1')
          .att('id', 'dsc-' + symbol.id),
      para,
      err;

  if (symbol.params) {
    desc.ele('h5').txt('Parameters:');
    para = desc.ele('p');
    symbol.params.forEach(function(param) {
      para.ele('code').txt(param.name).up()
          .ele('span').txt('- ' + param.description).up()
          .ele('span').att('style', 'color: #777').txt('(' + fuseTypes(param) + ')').up()
          .ele('br');
    });
  }

  if (symbol.returns) {
    desc.ele('h5').txt('Returns:');
    desc.ele('p')
        .ele('span')
          .txt(symbol.returns[0].description || '').up()
        .ele('span')
          .att('style', 'color: #777')
          .txt('(' + fuseTypes(symbol.returns[0]) + ')').up()
        .ele('br');
  }
  if (symbol.exceptions) {
    desc.ele('h5').txt('Throws errors:');
    err = desc.ele('p');
    symbol.exceptions.forEach(function(exc) {
      err.ele('span').txt(exc.description).up()
         .ele('span').att('style', 'color: #777').txt('(' + fuseTypes(exc) + ')').up()
         .ele('br');
    });
  }

  if (symbol.toplevel) {
    desc.up().up().ele('hr');
  }
}

function summarizeSymbol(symbol) {
  if (symbol.toplevel) {
    parent.ele('a').att('id', 'sum-' + symbol.id).txt(' ').up();

    if (hasDetails(symbol)) {
      parent.ele('button')
              .att('class', 'expansion btn btn-link pull-right')
              .ele('i').att('class', 'glyphicon glyphicon-chevron-down').txt(' ').up()
              .ele('i').att('class', 'glyphicon glyphicon-chevron-up').txt(' ').up()
            .up();
    }

    parent.ele('h3').txt(symbol.name).txt(symbol.signature).up()
          .ele('small')
            .att('style', 'margin: -0.5em 0 1em;')
            .ele('span', symbol.modifiers).att('style', 'color: #777').up()
            .txt(symbol.longname)
            .txt(symbol.longsignature).up()
          .ele('p').txt((symbol.kind === 'class' ? symbol.classdesc : symbol.description) || ' ');
  } else {
    parent.ele('a').att('id', 'sum-' + symbol.id).txt(' ').up();

    if (hasDetails(symbol)) {
      parent.ele('button')
        .att('class', 'expansion btn btn-link pull-right')
        .ele('i').att('class', 'glyphicon glyphicon-chevron-down').txt(' ').up()
        .ele('i').att('class', 'glyphicon glyphicon-chevron-up').txt(' ').up()
      .up();
    }

    parent.ele('h4').txt(symbol.name).txt(symbol.signature).up()
          .ele('small')
            .att('style', 'margin: -0.5em 0 1em;')
            .ele('span', symbol.modifiers).att('style', 'color: #777').up()
            .txt(symbol.longname)
            .txt(symbol.longsignature).up()
          .ele('p').txt(symbol.description || ' ');
  }
}

function processSymbol(symbol) {
  if (symbol.kind === 'package') {
    title.txt(symbol.name).txt(' - ').txt(symbol.description);
    header.ele('h1').txt(symbol.name).att('style', 'margin-left: 10px;')
          .ele('small').att('class', 'lead').txt(symbol.description).up();
  } else {
    if (symbol.toplevel) {
      indexSymbol(symbol);
    }

    if (needsDocs(symbol)) {
      parent = parent.ele('section')
          .att('class', 'symbol container-fluid' + (symbol.inherited ? ' inherited' : ''))
          .att('id', 'sym-' + symbol.id);
      if (hasDetails(symbol)) {
        parent.att('onclick', 'toggleSymbol("sym-' + symbol.id + '")');
      }

      summarizeSymbol(symbol);
      describeSymbol(symbol);

      parent = parent.up();
    }
  }
}

function write(doc, destination) {
  var contents = doc
        .end({ pretty: true, indent: '  ', newline: '\n' })
        .replace('<?xml version="1.0"?>\n', '');
  fs.outputFile(path.join(destination, 'index.html'), contents, function(err) {
    if (err) {
      throw err;
    }
  });
}

function publish(data, opts) {
  var doc = xmlbuilder.create('html').dec().dtd().root(),
      head,
      body,
      left,
      right;

  mode = opts.mode || 'public';

  head = doc.ele('head');
  title = head.ele('title');
  head.ele('meta').att('charset', 'utf-8');
  head.ele('link')
    .att('rel', 'stylesheet')
    .att('href', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css');
  head.ele('script')
    .raw('\nfunction toggleSymbol(id) {' +
            'var target = document.getElementById(id);\n' +
            'target.classList.toggle("expanded");\n' +
         '}\n');

  head.ele('style').raw('\n' +
  'html, body { height: 100%; }\n' +
  '.symbol { transition: all 0.3s; }\n' +
  '.symbol:hover { background: #f5f5f5; } \n' +
  // '.symbol-dsc { transition: max-height 0.5s; overflow: hidden; }\n' +
  '.symbol > .symbol-dsc { display: none; }\n' +
  '.symbol.expanded > .symbol-dsc { display: block; }\n' +
  '.symbol p.expansion { margin-top: 10px; }\n' +
  '.symbol .glyphicon-chevron-down { display: inline-block; }\n' +
  '.symbol.expanded .glyphicon-chevron-down { display: none; }\n' +
  '.symbol .glyphicon-chevron-up { display: none; }\n' +
  '.symbol.expanded .glyphicon-chevron-up { display: inline-block; }\n' +
  '.symbol[onclick] { cursor: pointer; }\n' +
  '.bottom-padding { height: 100px; }\n' +
  '.hbox { display: flex; flex-direction: row; align-items: stretch; }\n' +
  '.vbox { display: flex; flex-direction: column; align-items: stretch; }\n' +
  '.vbox > *, .hbox > * { padding: 0 10px; }\n' +
  '\n');

  body = doc.ele('body');
  header = body
            .ele('div').att('class', 'vbox').att('style', 'height: 100%;')
            .ele('div').att('style', 'flex: 0');
  left = header.up()
            .ele('div').att('class', 'hbox').att('style', 'flex: 1; min-height: 0;')
            .ele('div').att('style', 'flex: 0 1 350px; overflow-y: auto; min-height: 0;');

  right = left.up()
            .ele('div').att('style', 'flex: 1 1 800px; overflow-y: auto; ');
  index = left.ele('h3').txt('Contents').up()
              .ele('div').att('class', 'list-group');
  parent = right;

  traverse(data, processSymbol, { private: opts.private });

  right.ele('div').att('class', 'bottom-padding');

  write(doc, opts.destination);
}

exports.publish = publish;
