import { useEffect, useState } from "react";
import Opt from "./components/Opt";
import Alert from "./components/Alert";
import Loader from "./components/Loader";
import MenuUsers from "./components/MenuUsers";
import DifussionMenu from "./components/DifussionMenu";

export interface User {
  id: number;
  name: string;
  email: string;
  number: number;
  messages: string[];
  createdAt: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userSelected, setUserSelected] = useState<User | null>(null);
  const [difussion, setDifussion] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ state: boolean; text: string }>({
    state: false,
    text: "",
  });
  const [canUse, setCanUse] = useState(true);
  const [charged, setCharged] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resJson = await response.json();

      if (resJson.status !== 200) {
        setAlert({
          state: true,
          text: "Error al obtener usuarios",
        });
        setTimeout(() => {
          setAlert({
            ...alert,
            state: false,
          });
        }, 3000);
        setCharged(true);
        return;
      }
      console.log(resJson.data);
      setUsers(resJson.data);
      setCharged(true);
      reorder();
    } catch {
      setAlert({
        state: true,
        text: "Error al obtener usuarios",
      });
      setTimeout(() => {
        setAlert({
          ...alert,
          state: false,
        });
      }, 3000);
      setCharged(true);
      return;
    }
  };

  const openMenuOptions = (user: User) => {
    setUserSelected(user);
  };

  const [isDescending, setIsDescending] = useState(true);

  function reorder() {
    setUsers((prevUsers) => {
      const sortedUsers = [...prevUsers].sort((a, b) =>
        isDescending
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setIsDescending(!isDescending);

      return sortedUsers;
    });
  }

  const handleAlert = (message: string) => {
    setAlert({
      state: true,
      text: message,
    });
    setTimeout(() => {
      setAlert({
        ...alert,
        state: false,
      });
    }, 3000);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!charged && users.length === 0)
    return (
      <div className="w-[100dvw] h-[100dvh] flex flex-col items-center gap-4">
        <Loader clases="mt-[35dvh]" />
        <h1>Cargando usuarios...</h1>
      </div>
    );

  if (charged && users.length === 0)
    return (
      <div className="w-[100dvw] h-[100dvh] flex flex-col items-center gap-4">
        <h1 className="mt-[35dvh]">No hay usuarios registrados</h1>
      </div>
    );

  return (
    <main className="w-[95%] m-auto flex flex-col items-center">
      <Alert alert={alert} />

      {!canUse && <Loader clases={"absolute right-8 bottom-8 z-10"} />}

      {userSelected && (
        <MenuUsers
          handleAlert={handleAlert}
          setUsers={setUsers}
          userSelected={userSelected}
          setUserSelected={setUserSelected}
          canUse={canUse}
          users={users}
          setCanUse={setCanUse}
        />
      )}

      {difussion && (
        <DifussionMenu
          setDifussion={setDifussion}
          users={users}
          handleAlert={handleAlert}
          setCanUse={setCanUse}
          canUse={canUse}
        />
      )}

      <h1 className="mt-10 text-2xl">Panel de administrador</h1>

      <div className="w-full max-w-[1000px] mt-4 overflow-auto">
        <h2 className="grow text-lg font-medium mb-4">Usuarios registrados</h2>

        <div className="flex justify-end gap-2 max-[650px]:justify-start">
          <button
            className="px-3 py-1 bg-[#fff] text-black rounded font-medium text-sm hover:bg-[#ccc] transition-all max-[420px]:text-xs"
            onClick={() => {
              setDifussion(true);
            }}
          >
            Nueva difusión
          </button>

          <button
            className="px-3 py-1 bg-[#fff] text-black rounded font-medium text-sm hover:bg-[#ccc] transition-all max-[420px]:text-xs"
            onClick={reorder}
          >
            Ordenar de{" "}
            {isDescending
              ? "más nuevos a más antiguos"
              : "más antiguos a más nuevos"}
          </button>
        </div>
        <div className="w-full flex flex-col mt-2 min-w-[620px]">
          <ul className="w-full flex justify-between font-medium">
            <li className="w-[8%] rounded-tl-md">ID</li>
            <li className="w-[17%]">Nombre</li>
            <li className="w-[26%] min-w-[270px]  max-[420px]:min-w-[220px]">
              Email
            </li>
            <li className="w-[25%]">Numero</li>
            <li className="w-[14%] min-w-[90px]">Registro</li>
            <li className="w-[10%] flex justify-center rounded-tr-md">Opt</li>
          </ul>
          <div className="w-full flex flex-col max-h-[75dvh] overflow-auto">
            {users.map((user) => (
              <ul key={user.id} className="w-full text-sm flex justify-between">
                <li className="w-[8%] text-[#ffffffdd] overflow-auto">
                  {user.id - 2}
                </li>
                <li className="w-[17%] text-[#ffffffdd] overflow-auto">
                  {user.name}
                </li>
                <li className="w-[26%] text-[#ffffffdd] min-w-[270px]  max-[420px]:min-w-[220px] overflow-auto">
                  {user.email}
                </li>
                <li className="w-[25%] text-[#ffffffdd] overflow-auto">
                  {user.number}
                </li>
                <li className="w-[14%] min-w-[90px] text-[#ffffffdd]">
                  {user.createdAt.slice(0, 10)[10] !== "T"
                    ? user.createdAt.slice(0, 10)
                    : user.createdAt.slice(0, 9)}
                </li>
                <li className="w-[10%] flex justify-center">
                  <button
                    onClick={() => {
                      openMenuOptions(user);
                    }}
                    className="cursor-pointer"
                  >
                    <Opt size="24px" />
                  </button>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
