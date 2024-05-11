import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Pages from "@/pages/index";

const mockData = [
  {
    userId: 1,
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    userId: 1,
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    userId: 1,
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];

// vi.stubGlobal("fetch", vi.fn()); // Stubbing fetch globally

describe("Custom Posts Pages", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
        status: 201,
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("show skeleton on initial loading 404", async () => {
    const { container, getAllByTestId } = render(<Pages />);
    expect(container).toBeInTheDocument();
    expect(getAllByTestId("skeleton")).toHaveLength(8);
  });

  it("show add and data after loading", async () => {
    const { getByLabelText, getAllByTestId } = render(<Pages />);
    expect(getByLabelText("add")).toBeInTheDocument();
    expect(getAllByTestId("card-item")).toHaveLength(3);
    fireEvent.click(screen.getByLabelText("add"));
  });

  it("success add data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 4,
            title: "title123",
            body: "body 321",
          }),
        status: 201,
      })
    );
    const { rerender, getByLabelText, getAllByTestId } = render(<Pages />);
    expect(getAllByTestId("card-item")).toHaveLength(3);
    expect(getByLabelText("add")).toBeInTheDocument();
    await act(() => {
      fireEvent.click(screen.getByLabelText("add"));
    });
    // rerender(<Pages />);
    expect(screen.getByText("add post")).toBeInTheDocument();
    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();
    const bodyInput = screen.getByLabelText("Body");
    expect(bodyInput).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeDisabled();

    await act(() => {
      fireEvent.input(titleInput, { target: { value: "title123" } });
    });
    expect(titleInput).toHaveValue("title123");
    act(() => {
      fireEvent.input(bodyInput, { target: { value: "body 321" } });
    });
    expect(bodyInput).toHaveValue("body 321");

    expect(screen.getByText("Save")).not.toBeDisabled();
    act(() => {
      fireEvent.click(screen.getByText("Save"));
    });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      body: JSON.stringify({
        id: undefined,
        userId: 1,
        title: "title123",
        body: "body 321",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await waitFor(() => {
      expect(screen.getAllByTestId("card-item")).toHaveLength(4);
      expect(screen.getByText("title123")).toBeInTheDocument();
    });
  });

  it("success edit data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 4,
            title: "title123 edit",
            body: "body 321",
          }),
        status: 201,
      })
    );
    const { getByLabelText, getAllByTestId } = render(<Pages />);

    expect(getAllByTestId("card-item")).toHaveLength(4);
    expect(screen.getByText("title123")).toBeInTheDocument();
    expect(getByLabelText("edit-0")).toBeInTheDocument();

    await act(() => {
      fireEvent.click(getByLabelText("edit-0"));
    });
    // rerender(<Pages />);
    expect(screen.getByText("edit post")).toBeInTheDocument();

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("title123");
    const bodyInput = screen.getByLabelText("Body");
    expect(bodyInput).toBeInTheDocument();
    expect(bodyInput).toHaveValue("body 321");

    await act(() => {
      fireEvent.input(titleInput, { target: { value: "title123 edit" } });
    });
    expect(titleInput).toHaveValue("title123 edit");

    act(() => {
      fireEvent.click(screen.getByText("Save"));
    });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: "PUT",
      body: JSON.stringify({
        id: 4,
        title: "title123 edit",
        body: "body 321",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    await waitFor(() => {
      expect(screen.getAllByTestId("card-item")).toHaveLength(4);
      expect(screen.getByText("title123 edit")).toBeInTheDocument();
    });
  });

  it("success delete data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 200,
      })
    );
    const { getByLabelText, getAllByTestId } = render(<Pages />);

    expect(getAllByTestId("card-item")).toHaveLength(4);
    expect(screen.getByText("title123 edit")).toBeInTheDocument();
    expect(getByLabelText("delete-0")).toBeInTheDocument();

    await act(() => {
      fireEvent.click(getByLabelText("delete-0"));
    });
    // rerender(<Pages />);
    expect(screen.getByText("delete post")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You are about to delete data with title title123 edit. Are you sure?"
      )
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByText("Save"));
    });
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: "DELETE",
    });
    await waitFor(() => {
      expect(screen.getAllByTestId("card-item")).toHaveLength(3);
    });
  });
});
