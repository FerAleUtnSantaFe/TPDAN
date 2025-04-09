package isi.dan.msclientes.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "MS_CLI_CLIENTE")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="NOMBRE")
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @Column(name="CORREO_ELECTRONICO")
    @Email(message = "Email debe ser valido")
    @NotBlank(message = "Email es obligatorio")
    private String correoElectronico;

    @Column(name="CUIT")
    @NotBlank(message = "CUIT es obligatorio")
    private String cuit;

    @Column(name="MAX_DESCUBIERTO")
    @Min(value = 10000, message = "El descubierto maximo debe ser al menos 10000")
    private Double maximoDescubierto;

    @Column(name="MAX_OBRAS")
    @NotNull(message = "El maximo de obras es obligatorio")
    @Min(value = 0, message = "Error debe ser positivo")
    private Integer maximoDeObras;

    @Column(name="OBRAS_ACTIVAS")
    @NotNull(message = "El numero de obras activas es obligatorio")
    @Min(value = 0, message = "Error debe ser positivo")
    private Integer obrasActivas;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Obra> obras = new ArrayList<>();

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
        name = "cliente_usuario",
        joinColumns = @JoinColumn(name = "cliente_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id"))
    private List<Usuario> usuarios = new ArrayList<>();

    // Método para sincronizar los usuarios cuando se actualiza el cliente
    public void actualizarUsuarios(List<Usuario> nuevosUsuarios) {
        // Eliminar usuarios que ya no están en la lista recibida
        this.usuarios.removeIf(usuario -> !nuevosUsuarios.contains(usuario));

        // Añadir nuevos usuarios que no están en la lista actual
        for (Usuario nuevoUsuario : nuevosUsuarios) {
            if (!this.usuarios.contains(nuevoUsuario)) {
                this.usuarios.add(nuevoUsuario);
            }
        }
    }

    
}
