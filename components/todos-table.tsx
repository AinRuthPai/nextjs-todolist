'use client';

import React, { useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Spinner,
} from '@nextui-org/react';
import { Todo } from '@/types';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TodosTable({ todos }: { todos: Todo[] }) {
    // 할일 추가 가능 여부
    const [todoAddEnable, setTodoAddEnable] = useState(false);
    // input 필드
    const [newTodoInput, setNewTodoInput] = useState('');
    // 로딩 스피너
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    // 토스트 메세지
    const notify = () => toast('할 일 추가가 완료되었습니다.');

    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setTodoAddEnable(true);
        } else {
            setTodoAddEnable(false);
        }

        setNewTodoInput(e.target.value);
    };

    const addATodoHandler = async () => {
        if (todoAddEnable === true) {
            setIsLoading(true);
            setTodoAddEnable(false);
            await new Promise((f) => setTimeout(f, 500));
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
                method: 'post',
                body: JSON.stringify({
                    title: newTodoInput,
                }),
                cache: 'no-store',
            });
            setNewTodoInput('');
            notify();
            router.refresh();
            setIsLoading(false);
        } else {
            return;
        }
    };

    const TodoRow = (aTodo: Todo) => {
        // const [isDone, setIsDone] = useState<boolean>(aTodo.is_done);

        // const changeIsDone = () => {
        //     setIsDone(!isDone);
        //     router.refresh();
        // };

        return (
            <TableRow key={aTodo.id}>
                <TableCell>{aTodo.id.slice(0, 3)}</TableCell>
                <TableCell>{aTodo.title}</TableCell>
                <TableCell>{aTodo.is_done ? '⭕' : '❌'}</TableCell>
                <TableCell>{`${aTodo.created_at}`}</TableCell>
            </TableRow>
        );
    };
    return (
        <>
            <ToastContainer autoClose={1500} theme="dark" />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input type="text" label="새로운 할 일" onChange={changeInput} value={newTodoInput} />
                <Button
                    color={todoAddEnable ? 'primary' : 'default'}
                    isDisabled={todoAddEnable ? false : true}
                    className="h-14"
                    onClick={() => addATodoHandler()}
                >
                    추가
                </Button>
            </div>
            {isLoading && <Spinner size="sm" />}

            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn className="text-center">ID</TableColumn>
                    <TableColumn className="text-center">할일</TableColumn>
                    <TableColumn className="text-center">완료여부</TableColumn>
                    <TableColumn className="text-center">생성일</TableColumn>
                </TableHeader>
                <TableBody emptyContent={'데이터가 없습니다.'}>
                    {todos && todos.map((aTodo: Todo) => TodoRow(aTodo))}
                </TableBody>
            </Table>
        </>
    );
}
