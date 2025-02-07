import { rest } from "msw";
import { API_URL } from "../../app/constants";
import { screen, waitFor } from "@testing-library/react";
import { render } from "../../test-utils"
import { setupServer } from "msw/node";
import Cita from "./Cita";
import { mockedQuotes } from "./mocks/mockedQuotes";
import userEvent from '@testing-library/user-event';


const randomQuote = mockedQuotes[0].data
const validQueries = mockedQuotes.map((q) => q.query)

const renderComponent = () => {
    render(
        <Cita />
    )
}
// HANDLERS
const handlers = [
    rest.get(`${API_URL}`, (req, res, ctx) => {
        const character = req.url.searchParams.get('character');

        if (character === null) {
            return res(ctx.json([randomQuote]), ctx.delay(150));
        }

        if (validQueries.includes(character)) {
            const quote = mockedQuotes.find((q) => q.query === character);
            return res(ctx.json([quote?.data]));
        }

        return res(ctx.json([]), ctx.delay(150));
    }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
describe("Testeando el renderizado inicial del componente Quote", () => {
    test("Mostrar correctamente el mensaje inicial", () => {
        renderComponent();
        expect(screen.getByText("No se encontro ninguna cita")).toBeInTheDocument();
    });
    test("Renderización input búsqueda", async () => {
        renderComponent();
        const inputSearch = await screen.findByPlaceholderText('Ingresa el nombre del autor')
        expect(inputSearch).toBeVisible();
    })
    test("Mostrar el placeholder: Ingresa el nombre del autor, en el input", () => {
        renderComponent();
        expect(
            screen.getByPlaceholderText("Ingresa el nombre del autor")
        ).toBeInTheDocument();
    });
})
describe("Testeando el boton de cita aleatoria", () => {
    test("Mostrar: CARGANDO... al hacer click en cita aleatoria", async () => {
        renderComponent();
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        expect(await screen.findByText("CARGANDO...")).toBeInTheDocument();
    });
    test("Mostrar una cita al azar", async () => {
        renderComponent();
        const button = screen.getByText("Obtener cita aleatoria");
        userEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText("Chief Wiggum")).toBeInTheDocument()
        });
    });
})
describe("Testeando el ingreso de datos en el input", () => {
    test("Mostrar una cita de Lisa Simpson", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText("Ingresa el nombre del autor");
        await userEvent.type(input, "Lisa");
        const button = screen.getByText("Obtener Cita");
        await userEvent.click(button);
        await waitFor(() => expect(screen.queryByText("Lisa Simpson")));
    });
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
    test("Mostrar un un mensaje de error al ingresa un valor numérico", async () => {
        render(<Cita />);
        const input = screen.getByPlaceholderText('Ingresa el nombre del autor');
        await userEvent.type(input, '123456');
        const button = screen.getByText('Obtener Cita');
        await userEvent.click(button);
        expect(await screen.findByText('Por favor ingrese un nombre válido')).toBeInTheDocument();
    });

});
describe("Testeando el boton 'Borrar'", () => {
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