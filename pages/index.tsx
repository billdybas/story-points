import Head from 'next/head';
import { useEffect, useState } from 'react';
import { RoomService } from '@roomservice/browser';

const client = new RoomService({
  auth: '/api/roomservice',
});

function useList(roomName, listName) {
  const [list, setList] = useState();

  useEffect(() => {
    async function load() {
      const room = await client.room(roomName);
      const l = room.list(listName);
      setList(l);

      room.subscribe(l, (li) => {
        console.log(li);
        setList(li);
      });
    }
    load();
  }, []);

  return [list, setList];
}

export default function Home() {
  const [list, setList] = useList('lists', 'todos');
  const [text, setText] = useState('');

  function onCheckOff(i) {
    if (!list) return;
    console.log('delete', list);
    setList(list.delete(i));
  }

  function onEnterPress() {
    if (!list) return;
    setList(list.push(text));
    setText('');
  }

  return (
    <div className="container">
      <Head>
        <title>Story Points</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Todos</h2>
      <p>Press enter to add a new todo!</p>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onEnterPress();
          }
        }}
      />
      {list &&
        list.toArray().map((l, i) => (
          <p className="todo" key={JSON.stringify(l) + '-' + i} onClick={() => onCheckOff(i)}>
            {l.object || l}
            {'-'}
            {i}
          </p>
        ))}
      <style jsx>{`
        .container {
          margin: 0 auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
        }
        input {
          padding: 24px 24px;
          border-radius: 4px;
          border: 1px solid #cfdae2;
          border-bottom: 2px solid #cfdae2;
          display: flex;
          font-size: 1em;
          outline: none;
          transition all 0.15s;
          margin-bottom: 24px;
        }
        input:focus {
          border-color: #90a6b6;
          box-shadow: 10px 10px 30px #d3d5d6, -5px -5px 15px #ffffff;
        }
        .todo {
          padding: 12px;
          margin: 0;
          border-bottom: 1px dashed #cfdae2;
        }
        .todo:hover {
          background: #f8fafc;
          border-color: #50a2dd;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
