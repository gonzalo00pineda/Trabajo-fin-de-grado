export const obtenerLibros = (req, res) => {
    res.json({ message: 'Aquí devolvería la lista de libros desde Firestore' });
};

export const crearLibro = (req, res) => {
    res.json({ message: 'Aquí se crearía un nuevo libro en Firestore', data: req.body });
};

export const obtenerLibroPorId = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Aquí se devolvería el libro con ID ${id}` });
};
