import fakeData from "./tableDatas.json";
import "../components/style.css";
import { useTable } from "react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

function TableData() {
  const [data, setData] = useState([]);
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [assignedTo, setAssignedTo] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [description, setDescription] = useState("");
  const [isDataSet, setIsDataSet] = useState(false);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0 });
  const [showMobileNavbar, setShowMobileNavbar] = useState(false);

  const toggleMobileNavbar = () => {
    setShowMobileNavbar(!showMobileNavbar);
  };

  const tags = [
    { value: "01", label: "Tag 1" },
    { value: "02", label: "Tag 2" },
    { value: "03", label: "Tag 3" },
    { value: "04", label: "Tag 4" },
    { value: "05", label: "Tag 5" },
  ];
  const followers = [
    { label: "Follower1", value: "001" },
    { label: "Follower2", value: "002" },
    { label: "Follower3", value: "002" },
    { label: "Follower4", value: "004" },
    { label: "Follower5", value: "005" },
    { label: "Follower6", value: "006" },
  ];
  const users = [
    { label: "Rahul", value: "01" },
    { label: "Jyoti", value: "02" },
    { label: "Meera", value: "03" },
    { label: "Omkar", value: "04" },
  ];

  useEffect(() => {
    if (!isDataSet) {
      console.log(isDataSet);
      localStorage.setItem("tableData", JSON.stringify(fakeData));
      setIsDataSet(true);
      setData(fakeData);
    }
    setIsDataSet(true);
  }, [isDataSet]);

  const toggleInputPanel = () => {
    setShowInputPanel(!showInputPanel);
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (
      !taskName ||
      !assignedTo ||
      selectedTags.length === 0 ||
      selectedFollowers.length === 0 ||
      !endDate ||
      !description
    ) {
      alert("Please fill in all fields.");
      return;
    }
    const newEntry = {
      no: data.length + 1,
      task_name: taskName,
      assigned_to: [{ id: assignedTo.value, name: assignedTo.label }],
      start_date: new Date().toLocaleDateString(),
      end_date: endDate.toLocaleDateString(),
      tags:
        selectedTags.length === 1
          ? [{ id: selectedTags[0].value, name: selectedTags[0].label }]
          : selectedTags.map((tag) => ({ name: tag.label, id: tag.value })),
      followers:
        selectedFollowers.length === 1
          ? [
              {
                id: selectedFollowers[0].value,
                name: selectedFollowers[0].label,
              },
            ]
          : selectedFollowers.map((follower) => ({
              name: follower.label,
              id: follower.value,
            })),
      description: description,
      action: "Edit",
    };
    setData([...data, newEntry]);
    setTaskName("");
    setAssignedTo(null);
    setSelectedTags([]);
    setSelectedFollowers([]);
    setEndDate(null);
    setDescription("");
    localStorage.setItem("tableData", JSON.stringify([...data, newEntry]));
    const formData = {
      taskName,
      assignedTo: assignedTo ? assignedTo.value : null,
      selectedTags: selectedTags.map((tag) => tag.value),
      selectedFollowers: selectedFollowers.map((follower) => follower.value),
      startDate: endDate,
      description,
    };
    console.log(formData);
  };

  const handleEdit = (e, rowId, field) => {
    const rect = e.target.getBoundingClientRect();
    setEditingRowId(rowId);
    setEditingField(field);
    setTooltip({
      show: true,
      x: rect.left,
      y: rect.top + rect.height,
    });
  };
  const handleSave = (rowNo, newValue) => {
    console.log("handle save", rowNo, newValue);
    const newData = data.map((row) => {
      console.log(row.no.toString(), rowNo);
      if (row.no.toString() === (parseInt(rowNo) + 1).toString()) {
        console.log(row.no, rowNo + 1);
        return {
          ...row,
          task_name: newValue === "" ? row.task_name : newValue.toString(),
        };
      }
      return row;
    });
    console.log("new data", newData);
    setData(newData);
    localStorage.setItem("tableData", JSON.stringify(newData));
    setEditingRowId(null);
    setTooltip({ show: false, x: 0, y: 0 });
  };

  const handleCancel = () => {
    setTooltip({ show: false, x: 0, y: 0 });
  };
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        accessor: "no",
      },
      {
        Header: "Task Name",
        accessor: "task_name",
      },
      {
        Header: "Assigned to",
        accessor: "assigned_to",
        Cell: ({ value }) => <span>{value[0].name}</span>,
      },
      {
        Header: "Start Date",
        accessor: "start_date",
      },
      {
        Header: "End Date",
        accessor: "end_date",
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: ({ value }) => (
          <span>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="tagDiv">{value.length > 0 && value[0].name}</div>
              {value.length > 1 && (
                <div className="tagDiv">{`${value[1].name}`}</div>
              )}
              {value.length > 2 && (
                <div className="tagDivNumber">{` +${value.length - 2}`}</div>
              )}
            </div>
          </span>
        ),
      },

      {
        Header: "Followers",
        accessor: "followers",
        Cell: ({ value }) => (
          <span>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {value.length > 0 && <div className="">{value[0].name}</div>}
              {value.length > 1 && (
                <div className="tagDivNumber">{` +${value.length - 1}`}</div>
              )}
            </div>
          </span>
        ),
      },

      {
        Header: "Description",
        accessor: "description",
      },

      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => {
          return (
            <button
              className="right-button"
              onClick={(e) => handleEdit(e, row.id, "task_name")}
            >
              Edit
            </button>
          );
        },
      },
    ],
    [editingRowId]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const Tooltip = ({ x, y, onSave, onCancel }) => {
    const [editValue, setEditValue] = useState("");

    return (
      <div className="tooltip" style={{ left: x - 150, top: y + 10 }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="tooltip-input"
        />
        <button className="right-button-done" onClick={() => onSave(editValue)}>
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="TableData">
      <div className="navbar">
        <div className="navbar-content">
          <a href="#">Portfolio</a>
          <a href="#">Inbox</a>
          <a href="#">My Tasks</a>
          <a href="#">Help</a>
          <a href="#">Account</a>
        </div>

        <div className="hamburger" onClick={toggleMobileNavbar}>
          &#9776;
        </div>

        {showMobileNavbar && (
          <div className="navbar-content-mobile">
            <a href="#">Portfolio</a>
            <a href="#">Inbox</a>
            <a href="#">My Tasks</a>
            <a href="#">Help</a>
            <a href="#">Account</a>
          </div>
        )}
      </div>

      {tooltip.show && (
        <Tooltip
          x={tooltip.x}
          y={tooltip.y}
          onSave={(newValue) => handleSave(editingRowId, newValue)}
          onCancel={handleCancel}
        />
      )}
      {showInputPanel && (
        <div className="inputPanel">
          <form onSubmit={handleFormSubmit}>
            <div className="inputInner">
              <div className="inputTop">
                <h1 className="inputHeader">Add Data</h1>
                <h1 onClick={() => setShowInputPanel(false)} className="close">
                  X
                </h1>
              </div>
              <label>
                <span className="inputLabel">Task Name</span>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </label>
              <label className="inputLabel">
                Assigned To
                <Select
                  options={users}
                  value={assignedTo}
                  onChange={setAssignedTo}
                />
              </label>
              <label className="inputLabel">
                Tags
                <Select
                  isMulti
                  options={tags}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  placeholder={"Select tags"}
                />
              </label>
              <label className="inputLabel">
                Followers
                <Select
                  isMulti
                  options={followers}
                  value={selectedFollowers}
                  onChange={setSelectedFollowers}
                  placeholder={"Select followers"}
                />
              </label>
              <span className="span-tag">End Date</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Choose date"
                minDate={today}
              />
              <label className="inputLabel">
                Description
                <textarea
                  rows={3}
                  placeholder="..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <div className="right-button">
                <button type="submit">Save</button>
              </div>
              <div className="save-div"></div>
            </div>
          </form>
        </div>
      )}
      <div className="container">
        <div className="table-header">
          <div className="left-heading">Task Table</div>
          <div className="right-button">
            <button onClick={toggleInputPanel}>Enter New Data</button>
          </div>
        </div>
        <div class="table-wrapper">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="tableRow">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: "100px" }}></div>
      </div>
    </div>
  );
}

export default TableData;
