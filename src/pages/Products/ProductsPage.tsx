import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { Table } from '../../components/Common/Table';
import { Button } from '../../components/Common/Button';
import { Pagination } from '../../components/Common/Pagination';
import { Modal } from '../../components/Common/Modal';
import { Input } from '../../components/Common/Input';
import type { Product } from '../../types';

export const ProductsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { products, loading, pagination } = useAppSelector((state) => state.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
    });

    useEffect(() => {
        dispatch(fetchProducts({ page: 0, size: 10 }));
    }, [dispatch]);

    const handlePageChange = (page: number) => {
        dispatch(fetchProducts({ page, size: 10 }));
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setCurrentProduct(product);
            setFormData(product);
        } else {
            setCurrentProduct(null);
            setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
        setFormData({ name: '', description: '', price: 0, stockQuantity: 0 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentProduct?.id) {
            await dispatch(updateProduct({ id: currentProduct.id, product: formData }));
        } else {
            await dispatch(createProduct(formData));
        }
        handleCloseModal();
        dispatch(fetchProducts({ page: pagination.currentPage, size: 10 }));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            await dispatch(deleteProduct(id));
            dispatch(fetchProducts({ page: pagination.currentPage, size: 10 }));
        }
    };

    const columns = [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Nom' },
        { key: 'description', title: 'Description' },
        {
            key: 'price',
            title: 'Prix',
            render: (product: Product) => `${product.price} DH`,
        },
        { key: 'stockQuantity', title: 'Stock' },
        {
            key: 'actions',
            title: 'Actions',
            render: (product: Product) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(product)}
                    >
                        Modifier
                    </Button>
                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => product.id && handleDelete(product.id)}
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
                <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
                <Button onClick={() => handleOpenModal()}>Ajouter un produit</Button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <Table data={products} columns={columns} loading={loading} />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Annuler
                        </Button>
                        <Button onClick={handleSubmit}>Enregistrer</Button>
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
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <Input
                        label="Prix"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                    />
                    <Input
                        label="Quantité en stock"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                        required
                    />
                </form>
            </Modal>
        </div>
    );
};
