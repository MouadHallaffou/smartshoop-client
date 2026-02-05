import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
    fetchPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode,
    activatePromoCode,
    deactivatePromoCode,
} from '../../redux/slices/promoCodeSlice';
import { Table } from '../../components/Common/Table';
import { Button } from '../../components/Common/Button';
import { Input } from '../../components/Common/Input';
import { Pagination } from '../../components/Common/Pagination';
import { Modal } from '../../components/Common/Modal';
import type { CodePromo } from '../../types';

export const PromoCodesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { promoCodes, loading, pagination } = useAppSelector((state) => state.promoCodes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCode, setEditingCode] = useState<string | undefined>();
    const [formData, setFormData] = useState<CodePromo>({
        code: '',
        discountPercentage: 0,
        isActive: true,
        expirationDate: '',
    });

    useEffect(() => {
        dispatch(fetchPromoCodes({ page: 0, size: 10 }));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchPromoCodes({ page, size: 10 }));
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingCode(undefined);
        setFormData({
            code: '',
            discountPercentage: 0,
            isActive: true,
            expirationDate: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (promoCode: CodePromo) => {
        setIsEditMode(true);
        setEditingCode(promoCode.code);
        setFormData({
            code: promoCode.code,
            discountPercentage: promoCode.discountPercentage,
            isActive: promoCode.isActive,
            expirationDate: promoCode.expirationDate.split('T')[0],
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingCode(undefined);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Format the date to ISO 8601 format with time
        const formattedData = {
            ...formData,
            expirationDate: `${formData.expirationDate}T23:59:59`,
        };

        if (isEditMode && editingCode) {
            await dispatch(updatePromoCode({ code: editingCode, promoCode: formattedData }));
        } else {
            await dispatch(createPromoCode(formattedData));
        }
        handleCloseModal();
        dispatch(fetchPromoCodes({ page: pagination.currentPage, size: 10 }));
    };

    const handleDelete = async (code: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce code promo ?')) {
            await dispatch(deletePromoCode(code));
            dispatch(fetchPromoCodes({ page: pagination.currentPage, size: 10 }));
        }
    };

    const handleToggleActive = async (promoCode: CodePromo) => {
        if (promoCode.isActive) {
            await dispatch(deactivatePromoCode(promoCode.code));
        } else {
            await dispatch(activatePromoCode(promoCode.code));
        }
        dispatch(fetchPromoCodes({ page: pagination.currentPage, size: 10 }));
    };

    const columns = [
        { key: 'code', title: 'Code' },
        {
            key: 'discountPercentage',
            title: 'Réduction',
            render: (promo: CodePromo) => `${promo.discountPercentage}%`,
        },
        {
            key: 'expirationDate',
            title: "Date d'expiration",
            render: (promo: CodePromo) => new Date(promo.expirationDate).toLocaleDateString(),
        },
        {
            key: 'isActive',
            title: 'Statut',
            render: (promo: CodePromo) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${promo.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                >
                    {promo.isActive ? 'Actif' : 'Inactif'}
                </span>
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (promo: CodePromo) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleOpenEditModal(promo)}
                    >
                        Modifier
                    </Button>
                    <Button
                        size="sm"
                        variant={promo.isActive ? 'secondary' : 'success'}
                        onClick={() => handleToggleActive(promo)}
                    >
                        {promo.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(promo.code)}
                    >
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Codes Promo</h1>
                <Button onClick={handleOpenModal}>Créer un code promo</Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table data={promoCodes} columns={columns} loading={loading} />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={isEditMode ? "Modifier le code promo" : "Créer un code promo"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit}>
                            {isEditMode ? 'Modifier' : 'Créer'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <Input
                        label="Code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="PROMO-ABC123"
                        required
                        disabled={isEditMode}
                    /> */}

                    <Input
                        label="Pourcentage de réduction (%)"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={(e) =>
                            setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })
                        }
                        required
                    />

                    <Input
                        label="Date d'expiration"
                        type="date"
                        value={formData.expirationDate.split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        required
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                            Actif
                        </label>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
