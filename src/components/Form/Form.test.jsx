import { render, screen, waitFor } from '@testing-library/react';
import Form from '.';
import user from '@testing-library/user-event';
import { vi } from 'vitest';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast');

// test verisi
const testUser = {
    id: 'a123',
    name: 'Ahmet',
    email: 'ahmet@mail.com',
    age: '25'
};

it('form render edildiğinde inputlar ekrana basılır', () => {
    render(<Form addUser={vi.fn()} editUser={vi.fn()} userToEdit={null} setUserToEdit={vi.fn()} />);

    expect(screen.getByLabelText(/İsim/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yaş/i)).toBeInTheDocument();
});

it('form geçerli verilerle gönderildiğinde addUser çağrılmalı', async () => {
    user.setup();
    const mockFn = vi.fn();

    render(<Form addUser={mockFn} editUser={vi.fn()} userToEdit={null} setUserToEdit={vi.fn()} />);

    // Inputları bul

    const nameInp = screen.getByLabelText(/İsim/i);
    const mailInp = screen.getByLabelText(/Email/i);
    const ageInp = screen.getByLabelText(/Yaş/i);
    const sendBtn = screen.getByRole('button', { name: 'Kullanıcı Ekle' });

    // Veri gir

    await user.type(nameInp, testUser.name);
    await user.type(mailInp, testUser.email);
    await user.type(ageInp, testUser.age);

    // Formu gönder

    await user.click(sendBtn);

    // Mock fonksiyonunun doğru verilerle çağrıldığını kontrol et

    expect(mockFn).toHaveBeenCalledWith({
        name: testUser.name,
        email: testUser.email,
        age: testUser.age,
    });
    
    // Formun sıfırlandığını kontrol et

    await waitFor(() => {
        expect(nameInp).toHaveValue('');
    });
});

it('düzenleme modunda (editUser) gönderildiğinde editUser çağrılmalı', async () => {
    user.setup();
    const editMock = vi.fn();

    render(<Form addUser={vi.fn()} editUser={editMock} userToEdit={testUser} setUserToEdit={vi.fn()} />);

    // Formun düzenleme modunda olduğunu kontrol et

    const sendBtn = screen.getByRole('button', { name: 'Kullanıcıyı Güncelle' });

    // Inputları bul

    const nameInp = screen.getByLabelText(/İsim/i);
    
    // İsiimi güncelle

    await user.clear(nameInp);
    await user.type(nameInp, 'Güncel Ahmet');

    await user.click(sendBtn);

    // Mock fonksiyonunun çağrıldığını ve ID'yi içerdiğini kontrol et

    expect(editMock).toHaveBeenCalledWith({
        id: testUser.id, 
        name: 'Güncel Ahmet', 
        email: testUser.email,
        age: testUser.age,
    });
});

it('geçersiz email girildiğinde hata mesajı gösterilir ve addUser çağrılmaz', async () => {
    user.setup();
    const addMock = vi.fn();
    toast.error = vi.fn();

    render(<Form addUser={addMock} editUser={vi.fn()} userToEdit={null} setUserToEdit={vi.fn()} />);

    // Sadece geçersiz email gir

    await user.type(screen.getByLabelText(/Email/i), 'hataliemail');
    await user.click(screen.getByRole('button', { name: 'Kullanıcı Ekle' }));

    // Hata mesajı görünmeli

    expect(screen.getByText('Geçerli bir email gir')).toBeInTheDocument();
    
    // addUser çağrılmamalı

    expect(addMock).not.toHaveBeenCalled();
    
    // Toast çağrılmalı
    
    expect(toast.error).toHaveBeenCalled();
});