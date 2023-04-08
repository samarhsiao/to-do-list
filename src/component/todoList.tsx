import { useEffect, useState, useRef, useCallback } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import axios from 'axios';
import Swal from 'sweetalert2';
import ListItem from './listItem';
import { ToDoItem } from '../types/toDoItem';
import { ApiResponse, ApiReqData } from '../types/apiResponse';
//import { Fade } from "react-awesome-reveal";
const ToDoList = () => {
  const [today, setToday] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [allLists, setAllLists] = useState<ToDoItem[]>([
    {
      _id: '',
      title: '',
      isDone: false,
    },
  ]);

  useEffect(() => {
    const timestamp = Date.now();
    const timeObj = new Date(timestamp);
    const dayArray = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const index = +timeObj.getDay();
    setToday(dayArray[index]);
  }, []);

  const getAllLists = useCallback(async () => {
    try {
      const { data, status } = await axios.get<ApiResponse>(
        `${process.env.REACT_APP_API_URL}/api/todos`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (status === 200) {
        if (data.data) {
          setAllLists(data.data);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Swal.fire({
          text: `${err}`,
          icon: 'error',
          confirmButtonColor: '#060D08',
        });
      } else {
        Swal.fire({
          text: 'Unexpected error',
          icon: 'error',
          confirmButtonColor: '#060D08',
        });
      }
    }
  }, []);

  useEffect(() => {
    getAllLists();
  }, [getAllLists]);

  const addToList = async () => {
    if (!inputRef.current?.value) {
      setErrorMessage(true);
    } else {
      const reqData: ApiReqData = {
        title: inputRef.current.value,
        isDone: isChecked,
      };
      try {
        const { status } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/todos`,
          reqData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (status === 201) {
          //console.log(data);
          getAllLists();
          inputRef.current.value = '';
        }
        return;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          Swal.fire({
            text: `${err}`,
            icon: 'error',
            confirmButtonColor: '#060D08',
          });
        } else {
          Swal.fire({
            text: 'Unexpected error',
            icon: 'error',
            confirmButtonColor: '#060D08',
          });
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="wrapper col-lg-5 col-md-7 col-12">
        <div className="col-12">
          <div className="today">&#x1F9AD;{` Happy ${today} !`}</div>
          <div className="checkbox" id="select-all">
            <input type="checkbox" />
            <label>
              <span className="checkbox-mask"></span>
              <span className="">Select All</span>
            </label>
          </div>
          <ul className="todo-list ui-sortable">
            {allLists.map((item, i) => {
              return (
                <ListItem
                  key={`${item._id}_${i}`}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  isDeleted={isDeleted}
                  setIsDeleted={setIsDeleted}
                  item={item}
                  setAllLists={setAllLists}
                  allLists={allLists}
                  getAllLists={getAllLists}
                />
              );
            })}
          </ul>
          <div className="add-control">
            <div className="form-group flex-baseline col-10">
              <div className="flex-baseline">
                <span className="add-icon"></span>
                <textarea
                  rows={3}
                  className="add-item"
                  placeholder="Enter task,ideas..."
                  ref={inputRef}
                  onChange={() => {
                    setErrorMessage(false);
                  }}
                />
              </div>
              <div
                className="add-button"
                onClick={() => {
                  addToList();
                }}
              >
                Add
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="err text-danger">
              <RiErrorWarningLine style={{ width: '1.1em', height: '1.1em' }} />
              &nbsp;Oops! Please, enter name item
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
