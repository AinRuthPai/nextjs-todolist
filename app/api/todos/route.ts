import { NextRequest, NextResponse } from 'next/server';
import dummyTodos from '@/data/dummy.json';
import { fetchTodos, addATodo } from '@/data/firestore';

// 모든 할 일 가져오기
export async function GET(request: NextRequest) {
    const fetchedTodos = await fetchTodos();

    const response = {
        message: 'todos 전부 가져오기',
        data: fetchedTodos,
    };
    return NextResponse.json(response, { status: 200 });
}

// 할 일 추가
export async function POST(request: NextRequest) {
    const { title } = await request.json();

    if (title === undefined || title === '') {
        const errMessage = {
            message: '할일을 입력해주세요.',
        };
        // 서버에서 요청했을 때 데이터가 없는 경우 422 에러
        return NextResponse.json(errMessage, { status: 422 });
    }

    const addedTodo = await addATodo({ title });

    const response = {
        message: '할 일 추가 성공',
        data: addedTodo,
    };

    return Response.json(response, { status: 201 });
}
