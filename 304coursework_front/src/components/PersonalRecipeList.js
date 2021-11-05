import React from 'react'
import { Table, Form, Input, Popconfirm } from 'antd';
import reqwest from 'reqwest';

let query;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class RecipeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      editingKey: ''
    };
    this.columns = [
      {
        title: 'Image',
        dataIndex: 'mainImageURL',
        key: 'mainImageURL',
        render: (record) => 
        
          // console.log(`localhost:3000/${record}`)
          <img src={record} width="100px" alt="" />
      },
      {
        title: 'Title',
        dataIndex: 'title',
        width: '15%',
        editable: true,
        render: (text, record) => <a href={"/NutritionValue?recipeId="+`${record.ID}`} >{text}</a>
      },
      {
        title: 'Subtitle',
        dataIndex: 'subtitle',
        width: '15%',
        editable: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: '40%',
        editable: true,
      },
      {
        title: 'Ending',
        dataIndex: 'ending',
        width: '15%',
        editable: true,
      },
      {
        title: 'Date Created',
        dataIndex: 'DateCreated',
        width: '10%',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) => {
          console.log('recorddddddddddddddddd', record)
          console.log('recod.keyyyyyyyyyyyyyyyy', record.ID)
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.ID)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.ID)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.ID)}>
                Edit
              </a>

            );
        },
      },
    ];
  }


  isEditing = record => record.ID === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, ID) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];

      const index = newData.findIndex(item => ID === item.ID)
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(ID) {
    console.log('keyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy', ID)
    this.setState({ editingKey: ID });
  }

  componentDidMount() {
    console.log('props', this.props.location.search)
    query = this.props.location.search;
    console.log(query)
    this.fetch();
  }

  componentDidUpdate() {
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `http://localhost:3000/api/v1.0/recipes/username${query}`,
      method: 'get',
      data: {
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data,
        pagination,
      });
    });
  };

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          rowKey={record => record.ID}          
          loading={this.state.loading}
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const RecipeListForm = Form.create()(RecipeList)
export default RecipeListForm;