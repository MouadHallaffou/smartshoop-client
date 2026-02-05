import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchClients, createClient, updateClient, deleteClient } from '../../redux/slices/clientSlice';
import { Table } from '../../components/Common/Table';
import { Button } from '../../components/Common/Button';
import { Pagination } from '../../components/Common/Pagination';
import { Modal } from '../../components/Common/Modal';
import { Input } from '../../components/Common/Input';
import type { Client } from '../../types';

export const ClientsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { clients, loading, pagination } = useAppSelector((state) => state.clients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClient, setCurrentClient] = useState<Client | null>(null);
    const [formData, setFormData] = useState<Client>({
        username: '',
        email: '',
        password: '',
        name: '',
    });

    useEffect(() => {
        dispatch(fetchClients({ page: 0, size: 10 }));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchClients({ page, size: 10 }));
    };

    const handleOpenModal = (client?: Client) => {
        if (client) {
            setCurrentClient(client);
            setFormData({ ...client, password: '' });
        } else {
            setCurrentClient(null);
            setFormData({ username: '', email: '', password: '', name: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentClient(null);
        setFormData({ username: '', email: '', password: '', name: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentClient?.id) {
            await dispatch(updateClient({ id: currentClient.id, client: formData }));
        } else {
            await dispatch(createClient(formData));
        }
        handleCloseModal();
        dispatch(fetchClients({ page: pagination.currentPage, size: 10 }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            await dispatch(deleteClient(id));
            dispatch(fetchClients({ page: pagination.currentPage, size: 10 }));
        }
    };

    const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Nom' },
        { key: 'username', title: 'Username' },
        { key: 'email', title: 'Email' },
        {
            key: 'customerTier',
            title: 'Badge',
            render: (client: Client) => {
                const tierColors = {
                    BASIC: 'bg-gray-100 text-gray-800',
                    SILVER: 'bg-slate-100 text-slate-800',
                    GOLD: 'bg-yellow-100 text-yellow-800',
                    PLATINUM: 'bg-purple-100 text-purple-800',
                };
                const tier = client.customerTier || 'BASIC';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[tier]}`}>
                        {tier}
                    </span>
                );
            },
        },
        // {
        //     key: 'totalOrders',
        //     title: 'Commandes',
        //     render: (client: Client) => client.totalOrders || 0,
        // },
        {
            key: 'totalAmount',
            title: 'T.Cumulé',
            render: (client: Client) => `${(client.totalAmount || 0).toFixed(2)} DH`,
        },
        {
            key: 'actions',
            title: 'Actions',
            render: (client: Client) => (
                <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleOpenModal(client)}>
                        Modifier
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => client.id && handleDelete(client.id)}
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
                <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
                <Button onClick={() => handleOpenModal()}>Ajouter un client</Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table data={clients} columns={columns} loading={loading} />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentClient ? 'Modifier le client' : 'Ajouter un client'}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit} variant="primary">Enregistrer</Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    {!currentClient && (
                        <Input
                            label="Mot de passe"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    )}
                </form>
            </Modal>
        </div>
    );
};
