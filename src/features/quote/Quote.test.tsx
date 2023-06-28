import { render, screen } from "../../test-utils";
import { server } from "./mocks/server";
import Cita from "./Cita";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testeando componente Quote", () => {
    test("Mostrar correctamente el mensaje inicial", () => {
        render(<Cita />);
        expect(screen.getByText("No se encontro ninguna cita")).toBeInTheDocument();
    });

    test("Renderización input búsqueda", async () => {
        render(<Cita />);
        const inputSearch = await screen.findByPlaceholderText('Ingresa el nombre del autor')
        expect(inputSearch).toBeVisible();
    })
    test("Mostrar el placeholder: Ingresa el nombre del autor, en el input", () => {
        render(<Cita />);
        expect(
            screen.getByPlaceholderText("Ingresa el nombre del autor")
        ).toBeInTheDocument();
    });

    test("Mostrar una cita al azar", async () => {
        render(<Cita />);
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        await waitFor(() => expect(screen.queryByText("Duffman")));
    });
    test("Mostrar: CARGANDO... al hacer click en cita aleatoria", async () => {
        render(<Cita />);
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        expect(await screen.findByText("CARGANDO...")).toBeInTheDocument();
    });
    test("Mostrar mensaje de error cuando no encuentra el personaje", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
        await userEvent.type(input, "Dolores");
        const button = screen.getByText("Obtener Cita");
        await userEvent.click(button);
        await waitFor(() => expect(screen.queryByText("Por favor ingrese un nombre válido")));
    });
    test("Mostrar una cita de Lisa Simpson", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
        await userEvent.type(input, "Lisa");
        const button = screen.getByText("Obtener Cita");
        await userEvent.click(button);
        await waitFor(() => expect(screen.queryByText("Lisa Simpson")));
    });

    test("Al ingresa un valor numérico, se muestra un mensaje de error", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText('Ingresa el nombre del autor');
        await userEvent.type(input, '123456');
        const button = screen.getByText('Obtener Cita');
        await userEvent.click(button);
        expect(await screen.findByText('Por favor ingrese un nombre válido')).toBeInTheDocument();
    });

});