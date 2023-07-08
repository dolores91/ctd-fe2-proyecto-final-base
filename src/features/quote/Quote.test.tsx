import { render } from "../../test-utils";
import { server } from "./mocks/server";
import Cita from "./Cita";
import userEvent from "@testing-library/user-event";
import { waitFor, screen } from "@testing-library/react";


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Testeando el renderizado inicial del componente Quote", () => {
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
})
describe("Testeando el boton de cita aleatoria", () => {
    test("Mostrar: CARGANDO... al hacer click en cita aleatoria", async () => {
        render(<Cita />);
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        expect(await screen.findByText("CARGANDO...")).toBeInTheDocument();
    });
    test("Mostrar una cita al azar", async () => {
        render(<Cita />);
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText("Chief Wiggum")).toBeInTheDocument()
        });
    });


})


describe("Testeando el ingreso de datos en el input", () => {
    test("Mostrar mensaje de error con un nombre inválido", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
        await userEvent.type(input, "Dolores");
        const button = screen.getByText("Obtener Cita");
        await userEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText("Por favor ingrese un nombre válido")).toBeInTheDocument()
        });
    });
    test("Mostrar una cita de Lisa Simpson", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
        await userEvent.type(input, "Lisa");
        const button = screen.getByText("Obtener Cita");
        await userEvent.click(button);
        await waitFor(() => expect(screen.queryByText("Lisa Simpson")));
    });

    test("Mostrar un un mensaje de error al ingresa un valor numérico", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText('Ingresa el nombre del autor');
        await userEvent.type(input, '123456');
        const button = screen.getByText('Obtener Cita');
        await userEvent.click(button);
        expect(await screen.findByText('Por favor ingrese un nombre válido')).toBeInTheDocument();
    });

});
describe("Cuando se hace click en botón 'Borrar'", () => {
    test("Debería limpiar el input", async () => {
        render(<Cita />);
        const inputAutor = screen.getByLabelText("Author Cita")
        userEvent.click(inputAutor)
        await userEvent.keyboard('prueba')
        const btnBorrar = screen.getByRole('button', { name: /borrar/i })
        userEvent.click(btnBorrar)
        await waitFor(() => {
            expect(inputAutor).toHaveValue("")
        });
    });
    test("Mostrar 'No se encontró ninguna cita'", async () => {
        render(<Cita />);
        const button = screen.getByRole("button", { name: /Borrar/i });
        userEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText(/No se encontro ninguna cita/i)).toBeInTheDocument();
        });
    });
});