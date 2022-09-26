import { Button } from "@chakra-ui/button"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/modal"
import { useEffect, useState } from "react"
import { Task } from "../../../types/task.type"
import dateFormat from "dateformat";

const EditTask: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    addTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    task?: Task,
}> = ({ isOpen, onClose, addTask, updateTask, task = {} as Task }) => {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState(new Date())

    useEffect(()=> {
        setName(task.name || "")
        setDescription(task.description || "")
        setDueDate(task.dueDate || new Date())
    }, [task.name, task.description, task.dueDate])

    const closeThis = () => {
        setName('');
        setDescription('');
        setDueDate(new Date());
        onClose();
    }

    const save = () => {
        task.name = name;
        task.description = description;
        task.dueDate = dueDate;
        if (task.id) {
            updateTask(task)
        }
        else {
            addTask(task)
        }
        closeThis();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeThis}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{task.id? "Update Task": "Add Task"}</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input value={description} placeholder='Description' onChange={(e) => { setDescription(e.target.value) }} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Due Date</FormLabel>
                        <Input value={dateFormat(dueDate, 'yyyy-mm-dd')} placeholder='Due Date' type="date" onChange={(e) => { setDueDate(new Date(e.target.value)) }} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={save} colorScheme='blue' mr={3}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditTask