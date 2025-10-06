import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import App from '../App';
import user from '@testing-library/user-event';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast');

// window.confirmi mockla ve her zaman onay ver
const mockConfirm = vi.fn(() => true); 
window.confirm = mockConfirm; 

// LocalStorageı temizleyerek testleri izole et

vi.mock('../App', async (importOriginal) => {
    const actual = await importOriginal();
    localStorage.clear();
    return actual;
});


describe('CRUD Akışı (Bütünsel Testler)', () => {
    
    let initialRowCount;
    let nameInp, mailInp, ageInp, addBtn;
    const TEST_NAME = 'Tester İlk';
    const UPDATED_NAME = 'Tester Güncel';

    // Her testten önce Appi render et ve inputları sayıları hazırla
    beforeEach(() => {
        user.setup();
        render(<App />);

        // Başlangıç satır sayısını al (Başlık hariç: 15 kullanıcı + 1 başlık)
        initialRowCount = screen.getAllByRole('row').length - 1; 

        // Input'ları bir kere bul
        nameInp = screen.getByLabelText(/Adı Soyadı/i);  
        mailInp = screen.getByLabelText(/E-posta Adresi/i); 
        ageInp = screen.getByLabelText(/Yaşınız/i); 
        addBtn = screen.getByRole('button', { name: /Kullanıcı Ekle/i });
    });

    // 1. KULLANICI EKLEME  TESTİ 

    it('Yeni kullanıcı başarıyla eklenmeli', async () => {
        await user.type(nameInp, TEST_NAME);
        await user.type(mailInp, "ilk@test.com");
        await user.type(ageInp, '30'); 

        await user.click(addBtn);

        // Listede göründüğünü ve satır sayısının arttığını kontrol et

        expect(screen.getByText(TEST_NAME)).toBeInTheDocument();
        expect(screen.getAllByRole('row').length).toBe(initialRowCount + 2);
        expect(nameInp).toHaveValue(''); 
    });

    //2. KULLANICI GÜNCELLEME TESTİ

    it('Mevcut kullanıcı başarıyla güncellenmeli', async () => {

 
        const targetUserName = screen.getAllByRole('cell')[0].textContent; // İlk kullanıcıyı al
        
        // Düzenle butonunu bul ve tıkla (Başlangıç verisindeki ilk kullanıcıyı hedefliyoruz)

        const editButton = screen.getByRole('button', { name: `${targetUserName} kullanıcısını düzenle` });
        await user.click(editButton);
        
        // Formun Düzenle moduna geçtiğini kontrol et

        expect(screen.getByText(/Kullanıcıyı Düzenle/i)).toBeInTheDocument();
        
        // İsim alanını değiştir

        await user.clear(nameInp);
        await user.type(nameInp, UPDATED_NAME);

        const updateBtn = screen.getByRole('button', { name: /Kullanıcıyı Güncelle/i });
        await user.click(updateBtn);
        
        // Liste güncellendi mi?
        
        expect(screen.queryByText(targetUserName)).not.toBeInTheDocument();
        expect(screen.getByText(UPDATED_NAME)).toBeInTheDocument();

        // Satır sayısı değişmedi mi?
        expect(screen.getAllByRole('row').length).toBe(initialRowCount + 1);
    });
    
    //  3. KULLANICI SİLME  TESTİ 
    it('Kullanıcı başarıyla silinmeli', async () => {
        const targetUserName = screen.getAllByRole('cell')[0].textContent; // İlk kullanıcıyı al

        // Sil butonunu bul

        const deleteButton = screen.getByRole('button', { name: `${targetUserName} kullanıcısını sil` });
        await user.click(deleteButton);
        

        // Onay kutusu çıktı mı?
        expect(mockConfirm).toHaveBeenCalled();

        // Kullanıcının listeden silindiğini kontrol et

        await waitFor(() => {
            expect(screen.queryByText(targetUserName)).not.toBeInTheDocument();
        });
        
        // Satır sayısı azaldı mı?

        expect(screen.getAllByRole('row').length).toBe(initialRowCount);
    });

});