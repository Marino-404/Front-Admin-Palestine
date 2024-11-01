import { useState } from "react";
import Close from "./Close";
import { User } from "../App";
import Back from "./Back";

function MenuUsers({
  userSelected,
  setUserSelected,
  canUse,
  users,
  setCanUse,
  setUsers,
  handleAlert,
}: {
  userSelected: User;
  setUserSelected: (x: User | null) => void;
  canUse: boolean;
  users: User[];
  setCanUse: (x: boolean) => void;
  setUsers: (x: User[]) => void;
  handleAlert: (message: string) => void;
}) {
  const [mensajes, setMensajes] = useState(false);
  const [resMsg, setResMsg] = useState<null | string>(null);

  const onSubmit = async () => {
    if (!userSelected || !canUse) return;
    setCanUse(false);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userSelected.id,
        name: userSelected.name,
        email: userSelected.email,
        number: userSelected.number,
      }),
    });

    const resJson = await res.json();

    if (resJson.status !== 200) {
      console.log(resJson.message);
      setUserSelected(null);
      setCanUse(true);
      handleAlert("Error al actualizar usuario");
      return;
    } else {
      setUsers(
        users.map((user) => {
          if (user.id === userSelected.id) {
            return {
              ...user,
              name: userSelected.name,
              email: userSelected.email,
              number: userSelected.number,
            };
          } else {
            return user;
          }
        })
      );
      setUserSelected(null);
      setCanUse(true);
      handleAlert("Usuario actualizado correctamente");
    }
  };

  const deleteUser = async (id: number) => {
    if (!canUse) return;
    try {
      setCanUse(false);
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
        handleAlert("Error al eliminar usuario");
        setCanUse(true);
        return;
      } else {
        setUsers(users.filter((user) => user.id !== id));
        setCanUse(true);
        handleAlert("Usuario eliminado correctamente");
      }
    } catch {
      handleAlert("Error al eliminar usuario");
      setCanUse(true);
    }
  };

  const responseMessage = async (
    subject: string,
    title: string,
    message: string
  ) => {
    if (subject === "" || title === "" || message === "" || !canUse) return;
    setCanUse(false);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: subject,
            title: title,
            message: message,
            userEmail: userSelected.email,
            userMessage: resMsg,
          }),
        }
      );

      const resJson = await response.json();

      if (resJson.status !== 200) {
        setCanUse(true);
        handleAlert("Error al responder mensaje");

        return;
      } else {
        setCanUse(true);
        setResMsg(null);
        setUserSelected(null);
        handleAlert("Mensaje enviado exitosamente");
      }
    } catch {
      setCanUse(true);
      handleAlert("Error al responder mensaje");
    }
  };

  function isNumber(str: string) {
    if (typeof str !== "string" || str.trim() === "") {
      return false;
    }
    const num = Number(str);
    return !isNaN(num) && isFinite(num);
  }

  return (
    <div
      className={`w-[100dvw] absolute h-[100dvh] bg-[#00000080] backdrop-blur-sm flex justify-center pt-[20dvh] transition-all duration-300`}
    >
      {mensajes ? (
        <div className="w-[90%] max-w-[900px] h-fit pb-10 bg-[#141414] rounded-md">
          <div className="w-full flex justify-end pr-4 pt-6">
            <button
              onClick={() => {
                if (resMsg) {
                  setResMsg(null);
                } else {
                  setMensajes(false);
                }
              }}
              type="button"
            >
              <Back size="24px" />
            </button>
          </div>
          {resMsg ? (
            <div className="flex gap-2 w-[95%] m-auto flex-wrap max-[700px]:flex-col">
              <h3 className="text-xl font-medium w-full">Responder a</h3>
              <div className="text-sm w-[38%] max-[500px]:text-xs max-[700px]:w-full">
                <p className="mb-2">
                  <strong>Nombre:</strong> {userSelected.name}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {userSelected.email}
                </p>
                <p className="mb-2">
                  <strong>Número:</strong> {userSelected.number}
                </p>
                <p className="mb-2">
                  <strong>Fecha:</strong>{" "}
                  {new Date(userSelected.createdAt).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Mensaje:</strong>
                </p>
                <p className="break-words max-h-[200px] overflow-auto">
                  {resMsg}
                </p>
              </div>
              <form
                className="w-[60%] min-w-[280px] flex flex-col gap-2 mt-4 m-auto max-[700px]:w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  responseMessage(
                    (form.elements.namedItem("subject") as HTMLInputElement)
                      .value,
                    (form.elements.namedItem("title") as HTMLInputElement)
                      .value,
                    (form.elements.namedItem("message") as HTMLTextAreaElement)
                      .value
                  );
                }}
              >
                <input
                  type="text"
                  placeholder="Asunto"
                  id="subject"
                  name="subject"
                />
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Título"
                />
                <textarea
                  className="outline-none rounded text-black resize-none h-full p-1 min-h-32"
                  placeholder="Mensaje"
                  id="message"
                  name="message"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-600 px-3 py-1 rounded"
                    type="submit"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="max-w-[400px] m-auto">
              <h3 className="text-xl font-medium text-center ">Mensajes</h3>
              <ul className="flex flex-col gap-2 overflow-auto px-4 py-2 ">
                {users[users.indexOf(userSelected)].messages.length != 0 ? (
                  users[users.indexOf(userSelected)].messages.map((m, idx) => {
                    return (
                      <li
                        className="border rounded-md p-2 h-fit gap-2 max-[500px]:text-xs flex flex-col"
                        key={idx}
                      >
                        <p className="w-full text-wrap break-words">{m}</p>
                        <div className="w-full flex justify-end">
                          <button
                            onClick={() => setResMsg(m)}
                            className="bg-white text-xs font-medium text-black px-2 py-1 rounded"
                          >
                            Responder
                          </button>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="border-none text-center">No hay mensajes</li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="w-[80%] max-w-[400px] h-fit pb-10 bg-[#141414] rounded-md">
          <div className="w-full flex justify-end pr-4 pt-6">
            <button
              className="cursor-pointer"
              onClick={() => setUserSelected(null)}
            >
              <Close size="24px" />
            </button>
          </div>
          <h3 className="text-xl font-medium text-center">Opciones</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="flex flex-col gap-2 mt-4 w-[90%] m-auto"
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
                type="button"
                onClick={() => {
                  setMensajes(true);
                }}
                className="bg-blue-600 text-sm px-2 py-1 rounded"
              >
                Ver mensajes
              </button>
              <button
                className="bg-blue-600 text-sm px-2 py-1 rounded disabled:opacity-80"
                type="submit"
                disabled={!canUse}
              >
                Guardar
              </button>
              <button
                type="button"
                className="bg-[#a40101] text-sm px-2 py-1 rounded disabled:opacity-80"
                onClick={() => {
                  deleteUser(userSelected.id);
                }}
                disabled={!canUse}
              >
                Eliminar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MenuUsers;
