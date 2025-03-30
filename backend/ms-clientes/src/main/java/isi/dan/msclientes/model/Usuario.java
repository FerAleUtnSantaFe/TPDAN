package isi.dan.msclientes.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Entity
@Table(name = "MS_CLI_USUARIO")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name="NOMBRE")
    @NotNull(message = "El nombre es obligatorio")
    private String nombre;

    @Column(name="APELLIDO")
    @NotNull(message = "El apellido es obligatorio")
    private String apellido;

    @Column(name="CORREO_ELECTRONICO")
    @Email(message = "Email debe ser valido")
    @NotBlank(message = "Email es obligatorio")
    private String correoElectronico;
    
    @Column(name="DNI")
    @NotNull(message = "DNI es obligatorio")
    private String dni;

    @ManyToMany(mappedBy = "usuarios")
    @JsonIgnore
    private List<Cliente> clientes = new ArrayList<>();

}
