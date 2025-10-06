import { render, within, screen } from "@testing-library/react";
import List from ".";
import user from "@testing-library/user-event";
import { vi } from "vitest";
import toast from 'react-hot-toast'; 

// Global fonksiyonları ve toastı mocklama
vi.mock('react-hot-toast');
const mockConfirm = vi.fn();

// Her testten önce window.confirmi mock'la ve varsayılan olarak onayla
beforeEach(() => {
    mockConfirm.mockReturnValue(true); 
    window.confirm = mockConfirm;
});

// Test verisi 
const testUsers = [
    { id: 1, name: "Mehmet", email: "mehmet@gmail.com", age: "30" },
    { id: 2, name: "Ali", email: "ali@gmail.com", age: "25" }
];


it("gönderilen her kullanıcı için body kısmına bir satir eklenir", () => {
  render(<List users={testUsers} deleteUser={vi.fn()} setUserToEdit={vi.fn()} />);

  const body = screen.getByTestId("body");

  const rows = within(body).getAllByRole("row");

  expect(rows).toHaveLength(testUsers.length);

}); 

it("isim email ve yaş bilgileri users verisine göre ekrana basılıyor", () => {
  render(<List users={testUsers} deleteUser={vi.fn()} setUserToEdit={vi.fn()} />);

  expect(screen.getByText('Mehmet')).toBeInTheDocument();

  expect(screen.getByText('mehmet@gmail.com')).toBeInTheDocument();

  expect(screen.getByText(/30.*yaş/i)).toBeInTheDocument();
}); 

it("kullanıcı listesi boş olduğunda mesaj gösterilmeli", () => {
  render(<List users={[]} deleteUser={vi.fn()} setUserToEdit={vi.fn()} />);

  expect(screen.getByText(/Henüz kimse yok/i)).toBeInTheDocument();
});

it("sil butonuna tıklandığında onay verilirse deleteUser fonksiyonu çağrılmalı", async () => {
  user.setup();
  const deleteMock = vi.fn();
  
  render(<List users={[testUsers[0]]} deleteUser={deleteMock} setUserToEdit={vi.fn()} />);

  const deleteButton = screen.getByText(/Sil/i);
  await user.click(deleteButton);

  expect(mockConfirm).toHaveBeenCalled(); 
  expect(deleteMock).toHaveBeenCalledWith(1);

});

it("sil butonuna tıklandığında onay verilmezse silme fonksiyonu çağrılmamalı", async () => {
    user.setup();
    const deleteMock = vi.fn();
    toast.error = vi.fn(); 
    
    // Onay penceresinin iptal (false) döndürmesini sağlıyoruz
    mockConfirm.mockReturnValue(false); 
    
    render(<List users={[testUsers[0]]} deleteUser={deleteMock} setUserToEdit={vi.fn()} />);

    const deleteButton = screen.getByText(/Sil/i);
    await user.click(deleteButton);

    expect(deleteMock).not.toHaveBeenCalled(); 
    expect(toast.error).toHaveBeenCalledWith('Silme işlemi iptal edildi.'); 
});

it("düzenle butonuna tıklandığında setUserToEdit fonksiyonu çağrılmalı", async () => {
  user.setup();
  const setUserToEditMock = vi.fn();
  
  render(<List users={[testUsers[0]]} deleteUser={vi.fn()} setUserToEdit={setUserToEditMock} />);

  const editButton = screen.getByText(/Düzenle/i);
  await user.click(editButton);

  expect(setUserToEditMock).toHaveBeenCalledWith(testUsers[0]);
});

it("her kullanıcı için düzenle ve sil butonları olmalı", () => {
  render(<List users={testUsers} deleteUser={vi.fn()} setUserToEdit={vi.fn()} />);

  const editButtons = screen.getAllByText(/Düzenle/i);
  const deleteButtons = screen.getAllByText(/Sil/i);
  
  expect(editButtons).toHaveLength(2);
  expect(deleteButtons).toHaveLength(2);
});