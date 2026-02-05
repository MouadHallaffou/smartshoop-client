import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchOrders, createOrder, confirmOrder, cancelOrder } from '../../redux/slices/orderSlice';
import { fetchClients } from '../../redux/slices/clientSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { Table } from '../../components/Common/Table';
import { Button } from '../../components/Common/Button';
import { Pagination } from '../../components/Common/Pagination';
import { Modal } from '../../components/Common/Modal';
import type { Order, OrderItem } from '../../types';

export const OrdersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { orders, loading, pagination } = useAppSelector((state) => state.orders);
    const { clients } = useAppSelector((state) => state.clients);
    const { products } = useAppSelector((state) => state.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingOrderId, setEditingOrderId] = useState<number | undefined>();
    const [formData, setFormData] = useState<Order>({
        clientId: 0,
        orderItems: [],
    });

    useEffect(() => {
        dispatch(fetchOrders({ page: 0, size: 10 }));
        dispatch(fetchClients({ page: 0, size: 100 }));
        dispatch(fetchProducts({ page: 0, size: 100 }));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchOrders({ page, size: 10 }));
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setEditingOrderId(undefined);
        setFormData({ clientId: 0, orderItems: [{ productId: 0, quantity: 1 }] });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (order: Order) => {
        setIsEditMode(true);
        setEditingOrderId(order.id);
        setFormData({
            clientId: order.clientId,
            promoCode: order.promoCode || '',
            orderItems: order.orderItems.length > 0 ? order.orderItems : [{ productId: 0, quantity: 1 }],
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingOrderId(undefined);
        setFormData({ clientId: 0, orderItems: [] });
    };

    const handleAddOrderItem = () => {
        setFormData({
            ...formData,
            orderItems: [...formData.orderItems, { productId: 0, quantity: 1 }],
        });
    };

    const handleRemoveOrderItem = (index: number) => {
        setFormData({
            ...formData,
            orderItems: formData.orderItems.filter((_, i) => i !== index),
        });
    };

    const handleOrderItemChange = (index: number, field: keyof OrderItem, value: number) => {
        const newItems = [...formData.orderItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, orderItems: newItems });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && editingOrderId) {
            await dispatch(updateOrder({ id: editingOrderId, order: formData }));
        } else {
            await dispatch(createOrder(formData));
        }
        handleCloseModal();
        dispatch(fetchOrders({ page: pagination.currentPage, size: 10 }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
            await dispatch(deleteOrder(id));
            dispatch(fetchOrders({ page: pagination.currentPage, size: 10 }));
        }
    };

    const handleConfirm = async (id: number) => {
        await dispatch(confirmOrder(id));
        dispatch(fetchOrders({ page: pagination.currentPage, size: 10 }));
    };

    const handleCancel = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            await dispatch(cancelOrder(id));
            dispatch(fetchOrders({ page: pagination.currentPage, size: 10 }));
        }
    };

    const columns = [
        { key: 'id', title: 'ID' },
        {
            key: 'client',
            title: 'Client',
            render: (order: Order) => order.client?.name || '-',
        },
        {
            key: 'totalTTC',
            title: 'Montant Total TTC',
            render: (order: Order) => `${order.totalTTC || 0} DH`,
        },
        {
            key: 'montantReste',
            title: 'Reste à Payer',
            render: (order: Order) => `${order.montantReste || 0} DH`,
        },
        {
            key: 'status',
            title: 'Statut',
            render: (order: Order) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                >
                    {order.status || 'PENDING'}
                </span>
            ),
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (order: Order) => {
                const isPending = (order.status === 'PENDING' || order.orderStatus === 'PENDING');
                const hasPaiements = order.paiements && order.paiements.length > 0;
                const showButtons = isPending && !hasPaiements;

                return (
                    <div className="flex gap-2">
                        {showButtons && (
                            <>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleOpenEditModal(order)}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => order.id && handleConfirm(order.id)}
                                >
                                    Confirmer
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => order.id && handleCancel(order.id)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => order.id && handleDelete(order.id)}
                                >
                                    Supprimer
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
                <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>
                <Button onClick={handleOpenModal}>Créer une commande</Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table data={orders} columns={columns} loading={loading} />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={isEditMode ? "Modifier une commande" : "Créer une commande"}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit}>{isEditMode ? "Modifier" : "Créer"}</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: parseInt(e.target.value) })}
                            required
                        >
                            <option value={0}>Sélectionner un client</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code Promo (optionnel)</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Ex: PROMO-ABC123"
                            value={formData.promoCode || ''}
                            onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Articles</label>
                            <Button type="button" size="sm" onClick={handleAddOrderItem}>
                                Ajouter un article
                            </Button>
                        </div>
                        {formData.orderItems.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <select
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                    value={item.productId}
                                    onChange={(e) => handleOrderItemChange(index, 'productId', parseInt(e.target.value))}
                                    required
                                >
                                    <option value={0}>Sélectionner un produit</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - {product.price} DH
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Qté"
                                    value={item.quantity}
                                    onChange={(e) => handleOrderItemChange(index, 'quantity', parseInt(e.target.value))}
                                    required
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="danger"
                                    onClick={() => handleRemoveOrderItem(index)}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>
                </form>
            </Modal>
        </div>
    );
};
