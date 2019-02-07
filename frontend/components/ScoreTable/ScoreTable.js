import React from 'react';
import { connect } from 'react-redux';
import * as Table from 'reactabular-table';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

const UnsortedGlyph = (<i className="fa fa-sort fa-lg" style={{ color: '#D3D3D3' }}></i>);
const AcsGlyph = (<i className="fa fa-sort-up fa-lg"></i>);
const DescGlyph = (<i className="fa fa-sort-down fa-lg"></i>);

const getColumnFormatter = (field, labelText, clickHandler, sorts) => {
  const existingSort = sorts.find(x => x.field === field);
  const existingSortIndex = sorts.findIndex(x => x.field === field);
  const sortNumber = sorts.length  > 1 && existingSortIndex != -1 ? <span>{existingSortIndex+1}</span> : null;
  let element = null;
  let glyph = UnsortedGlyph;

  if (existingSort) {
    if (existingSort.reverse != undefined) {
      if (!existingSort.reverse) {
        glyph = AcsGlyph;
      } else if (existingSort.reverse) {
        glyph = DescGlyph;
      }
    }
  }

  element = field == 'score' ?
    (<div onClick={clickHandler} data-field={field} data-type="int">{labelText} {glyph} {sortNumber}</div>) :
    (<div onClick={clickHandler} data-field={field} data-type="string">{labelText} {glyph} {sortNumber}</div>);
  return element;
}

const getColumns = (clickHandler, sorts) => {
  const columns = [
    {
      property: 'id',
      header: {
        label: 'Id'
      }
    }, {
      property: 'name',
      header: {
        formatters: [
          () => getColumnFormatter('name', 'Name', clickHandler, sorts)
        ]
      }
    }, {
      property: 'family',
      header: {
        formatters: [
          () => getColumnFormatter('family', 'Family', clickHandler, sorts)
        ]
      }
    }, {
      property: 'city',
      header: {
        formatters: [
          () => getColumnFormatter('city', 'City', clickHandler, sorts)
        ]
      }
    }, {
      property: 'score',
      header: {
        formatters: [
          () => getColumnFormatter('score', 'Score', clickHandler, sorts)
        ]
      }
    }
  ]
  return columns;
}

export class ScoreTable extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    let field = e.target.attributes['data-field'] ? e.target.attributes['data-field'].value : null;
    let type = e.target.attributes['data-field'] ? e.target.attributes['data-type'].value : null;
    let altKeyPressed = e.altKey;
    // I am on a mac and I don't want to mess with my current keyboard settings.
    // Thus I am capturing the altKey which is option key on mac
    console.log(`'handleClick ${field} ${altKeyPressed}`)
    this.props.sortColumn(field, type, altKeyPressed);
  }

  render() {
    const score = this.props.score;
    const columns = getColumns(this.handleClick, this.props.score.sorts);
    return (
      <Table.Provider
        className="table table-striped table-bordered"
        columns={columns} >
        <Table.Header />
        <Table.Body rows={score.data} rowKey="id" />
      </Table.Provider>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    sortColumn: (field, type, append) => {
      return dispatch({
        type: 'APPLY_SORT',
        fieldName: field,
        fieldType: type,
        append
      })
    },
  })
}

const mapStateToProps = (state) => {
  return {
    score: state.score
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreTable);
