import { useEffect, useState } from "react";
import Opt from "./Opt";
import Close from "./Close";

interface User {
  id: number;
  name: string;
  email: string;
  number: number;
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

  const getData = async () => {
    try {
      console.log(`${import.meta.env.VITE_API_URL}/users`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resJson = await response.json();

      if (resJson.status !== 200) {
        console.log(resJson.message);
        return;
      }
      console.log(resJson.data);
      setUsers(resJson.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openMenuOptions = (user: User) => {
    console.log(user);
    setUserSelected(user);
  };

  const onSubmit = () => {
    console.log("enviar");
  };

  function isNumber(str: string) {
    // Verifica si el string es nulo, vacío o no es un string
    if (typeof str !== "string" || str.trim() === "") {
      return false;
    }

    // Intenta convertir el string a un número
    const num = Number(str);

    // Verifica si la conversión fue exitosa y si es un número finito
    return !isNaN(num) && isFinite(num);
  }

  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resJson = await response.json();

      setUserSelected(null);
      if (resJson.status !== 200) {
        console.log(resJson.message);
        return;
      } else {
        setUsers(users.filter((user) => user.id !== id));
        setAlert({
          state: true,
          text: "Usuario eliminado correctamente",
        });
        setTimeout(() => {
          setAlert({
            ...alert,
            state: false,
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendDiffusion = async (subject: string, message: string) => {
    console.log(subject, message);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/sendEmailToAll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: subject,
            message: message,
          }),
        }
      );

      const resJson = await response.json();

      if (resJson.status !== 200) {
        setAlert({
          state: true,
          text: "Error al enviar difusión",
        });
        setTimeout(() => {
          setAlert({
            state: false,
            text: "Error al enviar difusión",
          });
        }, 2000);
        return;
      } else {
        setAlert({
          state: true,
          text: "Difusión enviada exitosamente",
        });
        setTimeout(() => {
          setAlert({
            state: false,
            text: "Difusión enviada exitosamente",
          });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setAlert({
        state: true,
        text: "Error al enviar difusión",
      });
      setTimeout(() => {
        setAlert({
          state: false,
          text: "Error al enviar difusión",
        });
      }, 2000);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className="w-[95%] m-auto flex flex-col items-center">
      <div
        className={`absolute bottom-4 ${
          alert.state ? "left-4" : "left-[-100%]"
        } bg-[#fff] text-black rounded-md px-4 py-2 transition-all duration-300`}
      >
        <p>{alert.text}</p>
      </div>
      {userSelected && (
        <div
          className={`w-[100dvw] absolute h-[100dvh] bg-[#00000080] backdrop-blur-sm flex justify-center pt-[20dvh] transition-all duration-300`}
        >
          <div className="w-[80%] max-w-[400px] h-fit pb-10 bg-[#141414] rounded-md">
            <div className="w-full flex justify-end pr-4 pt-6">
              <button
                className="cursor-pointer"
                onClick={() => setUserSelected(null)}
              >
                <Close size="24px" />
              </button>
            </div>
            <h3 className="text-xl font-medium text-center mt-4">Opciones</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="flex flex-col gap-2 mt-2 w-[90%] m-auto"
            >
              <input
                className="outline-none"
                type="email"
                name=""
                value={userSelected.email}
                onChange={(e) => {
                  setUserSelected({
                    ...userSelected,
                    email: e.target.value,
                  });
                }}
              />
              <input
                className="outline-none"
                type="text"
                value={userSelected.name}
                onChange={(e) => {
                  setUserSelected({
                    ...userSelected,
                    name: e.target.value,
                  });
                }}
              />
              <input
                className="outline-none"
                type="text"
                value={userSelected.number}
                onChange={(e) => {
                  if (isNumber(e.target.value)) {
                    setUserSelected({
                      ...userSelected,
                      number: Number(e.target.value),
                    });
                  }
                }}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="bg-blue-600 text-sm px-2 py-1 rounded"
                  type="submit"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="bg-[#a40101] text-sm px-2 py-1 rounded"
                  onClick={() => {
                    deleteUser(userSelected.id);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {difussion && (
        <div
          className={`w-[100dvw] absolute h-[100dvh] bg-[#00000080] backdrop-blur-sm flex justify-center pt-[20dvh] transition-all duration-300`}
        >
          <div className="w-[80%] max-w-[400px] h-fit pb-10 bg-[#141414] rounded-md">
            <div className="w-full flex justify-end pr-4 pt-6">
              <button
                className="cursor-pointer"
                onClick={() => setDifussion(false)}
              >
                <Close size="24px" />
              </button>
            </div>
            <h3 className="text-xl font-medium text-center mt-4">
              Nueva difusión
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendDiffusion(
                  e.currentTarget.subject.value,
                  e.currentTarget.message.value
                );
                e.currentTarget.reset();
                setDifussion(false);
              }}
              className="flex flex-col gap-2 mt-2 w-[90%] m-auto"
            >
              <input
                className="outline-none"
                type="text"
                name="subject"
                placeholder="Asunto"
              />
              <textarea
                className="outline-none rounded text-black resize-none h-24 p-1"
                placeholder="Mensaje"
                name="message"
              />

              <div className="flex justify-end gap-2">
                <button className="bg-blue-600 px-3 py-1 rounded" type="submit">
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="mt-10 text-2xl">Panel de administrador</h1>

      <div className="w-full max-w-[1000px] mt-4 overflow-scroll">
        <div className="flex">
          <h2 className="grow">Usuarios registrados</h2>
          <button
            className="px-3 py-1 bg-[#fff] text-black rounded font-medium text-sm hover:bg-[#ccc] transition-all"
            onClick={() => {
              setDifussion(true);
            }}
          >
            Nueva difusión
          </button>
        </div>
        <div className="w-full flex flex-col mt-2 min-w-[700px]">
          <ul className="w-full flex justify-between">
            <li className="w-[8%]">ID</li>
            <li className="w-[15%]">Nombre</li>
            <li className="w-[35%] min-w-[320px]">Email</li>
            <li className="w-[20%]">Numero</li>
            <li className="w-[12%] min-w-[90px]">Registro</li>
            <li className="w-[10%] flex justify-center">Opt</li>
          </ul>
          <div className="w-full flex flex-col max-h-[75dvh] overflow-scroll">
            {users.map((user, idx) => (
              <ul key={user.id} className="w-full text-sm flex justify-between">
                <li className="w-[8%] text-[#ffffffdd] overflow-auto">
                  {idx + 1}
                </li>
                <li className="w-[15%] text-[#ffffffdd] overflow-auto">
                  {user.name}
                </li>
                <li className="w-[35%] text-[#ffffffdd] min-w-[320px] overflow-auto">
                  {user.email}
                </li>
                <li className="w-[20%] text-[#ffffffdd] overflow-auto">
                  {user.number}
                </li>
                <li className="w-[12%] min-w-[90px] text-[#ffffffdd]">
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
