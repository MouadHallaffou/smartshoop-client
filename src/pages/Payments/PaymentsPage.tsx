import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchPayments, createPayment, confirmPayment, cancelPayment } from '../../redux/slices/paymentSlice';
import { fetchOrders } from '../../redux/slices/orderSlice';
import { Table } from '../../components/Common/Table';
import { Button } from '../../components/Common/Button';
import { Pagination } from '../../components/Common/Pagination';
import { Modal } from '../../components/Common/Modal';
import { Input } from '../../components/Common/Input';
import type { Payment } from '../../types';

export const PaymentsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { payments, loading, pagination } = useAppSelector((state) => state.payments);
    const { orders } = useAppSelector((state) => state.orders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Payment>({
        orderId: 0,
        montant: 0,
        typePayment: 'ESPECE',
        datePaiement: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        dispatch(fetchPayments({ page: 0, size: 10 }));
        dispatch(fetchOrders({ page: 0, size: 100 }));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchPayments({ page, size: 10 }));
    };

    const handleOpenModal = () => {
        setFormData({
            orderId: 0,
            montant: 0,
            typePayment: 'ESPECE',
            datePaiement: new Date().toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(createPayment(formData));
        handleCloseModal();
        dispatch(fetchPayments({ page: pagination.currentPage, size: 10 }));
    };

    const handleConfirm = async (numero: string) => {
        await dispatch(confirmPayment(numero));
        dispatch(fetchPayments({ page: pagination.currentPage, size: 10 }));
    };

    const handleCancel = async (numero: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler ce paiement ?')) {
            await dispatch(cancelPayment(numero));
            dispatch(fetchPayments({ page: pagination.currentPage, size: 10 }));
        }
    };

    const columns = [
        {
            key: 'numeroPaiement',
            title: 'Numéro',
            render: (payment: Payment) => payment.numeroPaiement || payment.numero || '-',
        },
        {
            key: 'order',
            title: 'Commande',
            render: (payment: Payment) => `#${payment.orderId}`,
        },
        {
            key: 'montant',
            title: 'Montant',
            render: (payment: Payment) => `${payment.montant} DH`,
        },
        {
            key: 'typePaiement',
            title: 'Type',
            render: (payment: Payment) => payment.typePaiement || payment.typePayment,
        },
        {
            key: 'datePaiement',
            title: 'Date',
            render: (payment: Payment) => payment.datePaiement || '-',
        },
        {
            key: 'status',
            title: 'Statut',
            render: (payment: Payment) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                >
                    {payment.status || 'PENDING'}
                </span>
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (payment: Payment) => {
                const type = payment.typePaiement || payment.typePayment;
                const numero = payment.numeroPaiement || payment.numero;
                return (
                    <div className="flex gap-2">
                        {payment.status === 'PENDING' && type === 'CHEQUE' && numero && (
                            <>
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleConfirm(numero)}
                                >
                                    Confirmer
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleCancel(numero)}
                                >
                                    Annuler
                                </Button>
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Paiements</h1>
                <Button onClick={handleOpenModal}>Créer un paiement</Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table data={payments} columns={columns} loading={loading} />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Créer un paiement"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit}>Créer</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Commande</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.orderId}
                            onChange={(e) => setFormData({ ...formData, orderId: parseInt(e.target.value) })}
                            required
                        >
                            <option value={0}>Sélectionner une commande</option>
                            {orders.map((order) => (
                                <option key={order.id} value={order.id}>
                                    Commande #{order.id} - {order.client?.name} - {order.totalTTC || 0} DH
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Montant"
                        type="number"
                        step="0.01"
                        value={formData.montant}
                        onChange={(e) => setFormData({ ...formData, montant: parseFloat(e.target.value) })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de paiement</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.typePayment}
                            onChange={(e) => setFormData({
                                ...formData,
                                typePayment: e.target.value as Payment['typePayment'],
                                reference: '',
                                banque: '',
                                dateEcheance: '',
                            })}
                            required
                        >
                            <option value="ESPECE">Espèce</option>
                            <option value="CHEQUE">Chèque</option>
                            <option value="VIREMENT">Virement</option>
                        </select>
                    </div>

                    <Input
                        label="Date de paiement"
                        type="date"
                        value={formData.datePaiement}
                        onChange={(e) => setFormData({ ...formData, datePaiement: e.target.value })}
                        required
                    />

                    {formData.typePayment === 'CHEQUE' && (
                        <>
                            <Input
                                label="Référence du chèque"
                                value={formData.reference || ''}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                required
                            />
                            <Input
                                label="Banque"
                                value={formData.banque || ''}
                                onChange={(e) => setFormData({ ...formData, banque: e.target.value })}
                                required
                            />
                            <Input
                                label="Date d'échéance"
                                type="date"
                                value={formData.dateEcheance || ''}
                                onChange={(e) => setFormData({ ...formData, dateEcheance: e.target.value })}
                                required
                            />
                            <Input
                                label="Motif (optionnel)"
                                value={formData.motif || ''}
                                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                            />
                        </>
                    )}

                    {formData.typePayment === 'VIREMENT' && (
                        <>
                            <Input
                                label="Référence du virement"
                                value={formData.reference || ''}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                                required
                            />
                            <Input
                                label="Banque"
                                value={formData.banque || ''}
                                onChange={(e) => setFormData({ ...formData, banque: e.target.value })}
                                required
                            />
                            <Input
                                label="Date d'encaissement"
                                type="date"
                                value={formData.dateEncaissement || ''}
                                onChange={(e) => setFormData({ ...formData, dateEncaissement: e.target.value })}
                            />
                            <Input
                                label="Motif"
                                value={formData.motif || ''}
                                onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                                required
                            />
                        </>
                    )}

                    {formData.typePayment === 'ESPECE' && (
                        <Input
                            label="Référence (optionnel)"
                            value={formData.reference || ''}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                    )}
                </form>
            </Modal>
        </div>
    );
};
