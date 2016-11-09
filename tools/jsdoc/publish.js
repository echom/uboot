/* eslint-disable newline-per-chained-call */

var fs = require('fs-extra'),
    path = require('path'),
    xmlbuilder = require('xmlbuilder'),
    traverse = require('./traverse');

var title,
    header,
    index,
    parent;

function fuseTypes(part) {
  return part.type && part.type.names ? part.type.names.join('|') : '*';
}

function hasDetails(symbol) {
  var callable = symbol.callable,
      funcDetails = symbol.params || symbol.returns || symbol.exceptions,
      propDetails = symbol.properties;
  return (callable && funcDetails) || propDetails;
}

function indexSymbol(symbol) {
  var icon, title;
  switch (symbol.kind) {
    case 'class': icon = '&nbspf*'; title = 'Constructor'; break;
    case 'enum': icon = '&nbsp;e'; title = 'Enumeration'; break;
    case 'interface': icon = '&nbsp;(i)'; title = 'Interface'; break;
    case 'namespace': icon = '{ }'; title = 'Namespace'; break;
    default: icon = '&nbsp;??'; title = 'Unknown Symbol'; break;
  }

  index
    .ele('button')
      .att('class', 'list-group-item')
      .att('onclick', 'show("#sum-' + symbol.id + '")')
      .ele('span').raw(icon).att('title', title).up()
      .ele('span').raw('&nbsp;').txt(symbol.longname).up();
}

function describeSymbol(symbol) {
  var desc = parent
        .ele('div').att('class', 'symbol-dsc row')
        .ele('div')
          .att('class', 'col-xs-12')
          .att('id', 'dsc-' + symbol.id),
      augments,
      table,
      row;

  table = desc.ele('table')
    .att('class', 'table table-condensed borderless')
    .txt(' ');

  if (symbol.augments) {
    row = table.ele('tr');
    row.ele('td').ele('b').txt('Augments:');
    row.ele('td').att('colspan', 2).txt(symbol.augments.join(', '));
  }

  if (symbol.params) {
    row = table.ele('tr');
    row.ele('td').att('colspan', 3).ele('b').txt('Parameters:');

    symbol.params.forEach(function(param) {
      row = table.ele('tr');
      row.ele('td').ele('span').txt(param.name).up();
      row.ele('td').ele('span').att('style', 'color: #777').txt(fuseTypes(param));
      row.ele('td').ele('span').txt(param.description);
    });
  }

  if (symbol.returns) {
    row = table.ele('tr');
    row.ele('td').att('colspan', 3).ele('b').txt('Returns:');

    row = table.ele('tr');
    row.ele('td').att('style', 'color: #777')
      .ele('span').txt(fuseTypes(symbol.returns[0]));
    row.ele('td').att('colspan', 2)
      .ele('span').txt(symbol.returns[0].description || '');
  }

  if (symbol.exceptions) {
    row = table.ele('tr');
    row.ele('td').att('colspan', 3).ele('b').txt('Throws errors:');

    symbol.exceptions.forEach(function(exc) {
      row = table.ele('tr');
      row.ele('td')
        .ele('span').att('style', 'color: #777').txt(fuseTypes(exc));
      row.ele('td').att('colspan', 2)
        .ele('span').txt(exc.description);
    });
  }

  if (symbol.properties) {
    row = table.ele('tr');
    row.ele('td').att('colspan', 3).ele('b').txt('Properties:');

    symbol.properties.forEach(function(prop) {
      row = table.ele('tr');
      row.ele('td').ele('span').txt(prop.name);
      row.ele('td').ele('span').att('style', 'color: #777').txt(fuseTypes(prop));
      row.ele('td').ele('span').txt(prop.description);
    });
  }

  desc.up();
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
    parent.ele('h4')
          .ele(symbol.scope === 'static' ? 'i' : 'span').txt(symbol.name).txt(symbol.signature).up()
          .up()
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
      parent.ele('hr');
    }

    parent = parent.ele('section')
        .att(
          'class',
          'symbol container-fluid' +
          (symbol.inherited ? ' inherited' : '') +
          (symbol.toplevel ? ' toplevel' : '')
        )
        .att('id', 'sym-' + symbol.id);
    if (hasDetails(symbol)) {
      parent.att('onclick', 'toggleSymbol("sym-' + symbol.id + '")');
    }

    summarizeSymbol(symbol);
    describeSymbol(symbol);

    parent = parent.up();
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

  head = doc.ele('head');
  title = head.ele('title');
  head.ele('meta').att('charset', 'utf-8');
  head.ele('link')
    .att('rel', 'stylesheet')
    .att('href', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css');
  head.ele('script')
    .raw([
      'function toggleSymbol(id) {',
      'var target = document.getElementById(id);',
      'target.classList.toggle("expanded");',
      '}',
      'function show(id) {',
      'document.querySelector(id).scrollIntoView({ behavior: "smooth" });',
      '}'
    ].join('\n'));

  head.ele('style').raw('\n' +
  'html, body { height: 100%; }\n' +
  '.symbol { transition: all 0.3s; padding-left: 20px; }\n' +
  '.symbol.toplevel { transition: all 0.3s; padding-left: 10px; }\n' +
  '.symbol[onclick]:hover { background: #f5f5f5; } \n' +
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
  '.list-group .list-group-item { padding: 5px 15px; }' +
  'table.table.borderless td, table.table.borderless th { border: none; }' +
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

  traverse(data, processSymbol, { private: opts.private, protected: opts.protected });

  right.ele('div').att('class', 'bottom-padding');

  write(doc, opts.destination);
}

exports.publish = publish;
