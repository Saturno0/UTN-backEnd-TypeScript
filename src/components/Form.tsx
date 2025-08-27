

const Form = () => {
    return (
        <main>
            <div className="formulario">
                <h2>Formulario de contacto</h2>
                <div className="formulario-container">
                    <form action="submit" className="formulario-form">
                        <label htmlFor="NAME">Nombre:</label>
                        <input type="text" name="nombre" id="NAME" required />
                        <label htmlFor="EMAIL">Email:</label>
                        <input type="email" name="email" id="EMAIL" required />
                        <label htmlFor="TELEFONO">Teléfono:</label>
                        <input type="tel" name="telefono" id="TELEFONO" required
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" 
                            placeholder="Formato: 123-456-7890"
                        />
                        <label htmlFor="MENSAJE">Mensaje</label>
                        <textarea name="mensaje" id="MENSAJE" cols={30} rows={10} required></textarea>
                        <input type="submit" value="ENVIAR" id="Enviar" />
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Form;