import { useEffect, useState } from "react";
import { User } from "../App";
import Close from "./Close";

function DifussionMenu({
  setDifussion,
  users,
  setCanUse,
  canUse,
  handleAlert,
}: {
  setDifussion: (x: boolean) => void;
  users: User[];
  setCanUse: (x: boolean) => void;
  canUse: boolean;
  handleAlert: (message: string) => void;
}) {
  const [month, setMonth] = useState<number>(-2);
  const [year, setYear] = useState<number>(-2);
  const [checked, setChecked] = useState<string[]>([]);

  const sendDiffusion = async (
    subject: string,
    message: string,
    title: string
  ) => {
    if (!canUse) return;
    if(subject === "" || message === "" || title === "") return;
    if (checked.length === 0) {
      handleAlert("ERROR: Debes seleccionar al menos un usuario");
      return;
    }
    setCanUse(false);
    
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
            title: title,
            message: message,
            emails: checked,
          }),
        }
      );

      const resJson = await response.json();

      if (resJson.status !== 200) {
        setCanUse(true);
        handleAlert("Error al enviar difusión");

        return;
      } else {
        setCanUse(true);
        setDifussion(false);
        handleAlert("Difusión enviada exitosamente");
      }
    } catch {
      setCanUse(true);
      handleAlert("Error al enviar difusión");
    }
    setMonth(-2);
    setYear(-2);
  };

  useEffect(() => {
    const filteredEmails = users
      .filter((user) => {
        const createdDate = new Date(user.createdAt);
        const userMonth = createdDate.getMonth();
        const userYear = createdDate.getFullYear();
  
        const monthMatch = (month === -1 || month === userMonth);
        const yearMatch = year === -1 || year === userYear;
  
        // Manejo de casos no especificados
        if (month === -2 && year === -2) return false; // No seleccionar si ambos son no especificados
        if (month === -2) return yearMatch; // Filtrar solo por año
        if (year === -2) return monthMatch; // Filtrar solo por mes
  
        // Ambos especificados
        return monthMatch && yearMatch;
      })
      .map((user) => user.email);
  
    setChecked(filteredEmails);
  }, [month, year]);

  return (
    <div
      className={`w-[100dvw] absolute h-[100dvh] bg-[#00000080] backdrop-blur-sm flex justify-center pt-[20dvh] transition-all duration-300`}
    >
      <div className="w-[90%] max-w-[700px] px-6 max-[500px]:px-4 flex-wrap h-fit pb-10 bg-[#141414] rounded-md justify-center">
        <div className="w-full flex justify-end pr-4 pt-6">
          <button
            className="cursor-pointer"
            onClick={() => {
              setDifussion(false);
              setChecked([]);
              setMonth(-1);
              setYear(-1);
            }}
          >
            <Close size="24px" />
          </button>
        </div>
        <h3 className="text-xl font-medium w-full mb-4">Nueva difusión</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            sendDiffusion(
              (form.elements.namedItem("subject") as HTMLInputElement).value,
              (form.elements.namedItem("message") as HTMLTextAreaElement).value,
              (form.elements.namedItem("title") as HTMLInputElement).value
            );
          }}
          className="flex gap-2 mt-4 w-full flex-wrap justify-between "
        >
          <div className="flex flex-col gap-2 w-[49%] max-[650px]:w-[95%]">
            <input
              className="outline-none"
              type="text"
              name="subject"
              placeholder="Asunto"
            />
            <input type="text" className="outline-none" placeholder="Título" name="title" />
            <textarea
              className="outline-none rounded text-black resize-none h-full p-1 min-h-24"
              placeholder="Mensaje"
              name="message"
            />
          </div>
          <div className="max-[650px]:w-[95%] w-[49%] min-w-[280px]">
            <h3 className="mt-2">Usuarios a enviar</h3>
            <div className="flex flex-col mb-4">
              <label className="text-xs mb-1 mt-2 ">Mes de registro</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                <option value={-2}>No especificado</option>
                <option value={-1}>Todos</option>
                <option value={0}>Enero</option>
                <option value={1}>Febrero</option>
                <option value={2}>Marzo</option>
                <option value={3}>Abril</option>
                <option value={4}>Mayo</option>
                <option value={5}>Junio</option>
                <option value={6}>Julio</option>
                <option value={7}>Agosto</option>
                <option value={8}>Septiembre</option>
                <option value={9}>Octubre</option>
                <option value={10}>Noviembre</option>
                <option value={11}>Diciembre</option>
              </select>
              <label className="text-xs mb-1 mt-2 ">Año de registro</label>
              <select
                value={year}
                className="min-w-[80px]"
                onChange={(e) => setYear(Number(e.target.value))}
              >
                <option value={-2}>No especificado</option>
                <option value={-1}>Todos</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2024 + 1 },
                  (_, index) => 2024 + index
                ).map((year) => {
                  return (
                    <option className="min-w-[80px]" key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            <ul className="flex flex-col w-full gap-1 max-h-[150px] overflow-auto mb-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="border-none flex items-center"
                >
                  <input
                    type="checkbox"
                    name="users"
                    id={`checkbox-${user.id}`}
                    className="w-3 h-3 bg-gray-100  rounded"
                    value={user.id}
                    checked={checked.includes(user.email)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setChecked([...checked, user.email]);
                      } else {
                        setChecked(
                          checked.filter((email) => email !== user.email)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`checkbox-${user.id}`}
                    className="cursor-pointer pl-2"
                  >
                    {user.email}
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex justify-end gap-2">
              <button className="bg-blue-600 px-3 py-1 rounded" type="submit">
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DifussionMenu;
