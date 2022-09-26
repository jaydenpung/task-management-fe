import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "./Task.module.scss";
import { Text, Center, Button, useToast, Input, Flex } from "@chakra-ui/react";
import { Task } from "../../types/task.type";
import { BASE_URL } from "../../constants";
import { TableColumn, SortOrder } from "react-data-table-component";
import DataTable from "react-data-table-component";
import EditTask from "./components/EditTask";
import dateFormat from "dateformat";

const Task: NextPage = () => {
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [selectedTask, setSelectedTask] = useState<Task>();
	const [openEditTaskModal, setOpenEditTaskModal] = useState(false);
	const onClose = () => {
		setOpenEditTaskModal(false);
		setSelectedTask({} as Task);
	};
	const toast = useToast();
	const columns = [
		{
			name: "Id",
			selector: (row) => row.id,
			sortable: true,
			sortField: "id",
		},
		{
			name: "Name",
			selector: (row) => row.name,
			sortable: true,
			sortField: "name",
		},
		{
			name: "Description",
			selector: (row) => row.description,
			sortable: true,
			sortField: "description",
		},
		{
			name: "Status",
			selector: (row) => row.status,
			sortable: true,
			sortField: "dueDate", // status is generated based on dueDate
		},
		{
			name: "Due Date",
			selector: (row) => dateFormat(row.dueDate, 'yyyy-mm-dd'),
			sortable: true,
			sortField: "dueDate",
		},
		{
			name: "Created At",
			selector: (row) => dateFormat(row.createdAt, 'yyyy-mm-dd'),
			sortable: true,
			sortField: "createdAt",
		},
		{
			name: "Actions",
			sortable: false,
			cell: (task: Task) => (
				<Flex>
					<Button w="100px" onClick={() => openTaskModal(task)}>
						Edit
					</Button>
					<Button
						onClick={() => {
							deleteTask(task.id);
						}}
					>
						Delete
					</Button>
				</Flex>
			),
		},
	] as TableColumn<Task>[];
	const addTask = (task: Task) => {
        setLoading(true);
		fetch(BASE_URL + "tasks", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(task),
		})
			.then((res) => res.json())
			.then((resp) => {
				if (resp.success) {
					fetchTasks();
					setOpenEditTaskModal(false);
                    toast({
                        description: "Added!",
                        status: "success",
                    })
				} else {
					toast({
						description: resp.error.description,
						status: "error",
					});
				}
                setLoading(false);
			});
	};
	const updateTask = (task: Task) => {
        setLoading(true);
		fetch(BASE_URL + "tasks/" + task.id, {
			method: "PATCH",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(task),
		})
			.then((res) => res.json())
			.then((resp) => {
				if (resp.success) {
                    fetchTasks();
					setOpenEditTaskModal(false);
                    toast({
                        description: "Updated!",
                        status: "success",
                    })
				} else {
					toast({
						description: resp.error.description,
						status: "error",
					});
				}
                setLoading(false);
			});
	};
	const deleteTask = (id: number) => {
        setLoading(true);
		fetch(BASE_URL + "tasks/" + id, {
			method: "DELETE",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id,
			}),
		})
			.then((res) => res.json())
			.then((resp) => {
				if (resp.success) {
					fetchTasks();
					setOpenEditTaskModal(false);
                    toast({
                        description: "Deleted!",
                        status: "success",
                    })
				} else {
					toast({
						description: resp.error.description,
						status: "error",
					});
				}
                setLoading(false);
			});
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
	const [sort, setSort] = useState("");
	const [searchValue, setSearchValue] = useState("");

	const fetchTasks = async (
		newPage?: number,
		newPerPage?: number,
		newSort?: string
	) => {
		setLoading(true);
		const url = `${BASE_URL}tasks?page=${newPage ?? currentPage}&limit=${
			newPerPage ?? perPage
		}&orderBy=${newSort ?? sort}&name=${searchValue}`;
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				const taskList = data.data as Task[];
                if (taskList?.length) {
                    for (const task of taskList) {
                        task.dueDate = new Date(task.dueDate);
                        task.createdAt = new Date(task.createdAt);
                    }
                }
                
				setTaskList(taskList);
				setLoading(false);
				setCurrentPage(newPage ?? currentPage);
				setPerPage(newPerPage ?? perPage);
				setSort(newSort ?? sort);
			});
		fetch(`${url}&paginationMeta=true`)
			.then((res) => res.json())
			.then((data) => {
				setTotalRows(data.data.totalItems);
				setLoading(false);
			});
	};

	const handlePageChange = (page: number) => {
		fetchTasks(page);
	};

	const handlePerRowsChange = async (newPerPage: number, page: number) => {
		fetchTasks(page, newPerPage);
	};

	const handleSort = async (
		column: TableColumn<Task>,
		sortDirection: SortOrder
	) => {
		const sortParam = `${sortDirection === "desc" ? "-" : ""}${
			column.sortField
		}`;
		fetchTasks(currentPage, perPage, sortParam);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			fetchTasks();
		}
	};
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value);
	};

	useEffect(() => {
		fetchTasks(); // fetch page 1 of users
	}, []);

	const openTaskModal = (task?: Task) => {
		setSelectedTask(task);
		setOpenEditTaskModal(true);
	};

	return (
		<div className={styles.container}>
			<Center>
				<Text fontSize="3xl">Task List</Text>
			</Center>
			<Flex>
				<Button w="100px" onClick={() => openTaskModal()}>
					Add Task
				</Button>
				<Input
					placeholder="Search by name"
					value={searchValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
				></Input>
			</Flex>
			<DataTable
				columns={columns}
				data={taskList}
				progressPending={loading}
				pagination
				sortServer
				paginationServer
				paginationTotalRows={totalRows}
				onSort={handleSort}
				onChangeRowsPerPage={handlePerRowsChange}
				onChangePage={handlePageChange}
			/>

			<EditTask
				isOpen={openEditTaskModal}
				onClose={onClose}
				addTask={addTask}
				updateTask={updateTask}
				task={selectedTask}
			></EditTask>
		</div>
	);
};

export default Task;
