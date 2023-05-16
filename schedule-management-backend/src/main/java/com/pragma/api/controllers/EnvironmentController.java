package com.pragma.api.controllers;

import com.pragma.api.services.IEnvironmentService;
import com.pragma.api.domain.EnvironmentDTO;
import com.pragma.api.domain.GenericPageableResponse;
import com.pragma.api.domain.ResourceList;
import com.pragma.api.domain.Response;
import com.pragma.api.model.Environment;
import com.pragma.api.model.enums.EnvironmentTypeEnumeration;
import com.pragma.api.services.IFileEnvironmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/environment")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class EnvironmentController {

    private final IEnvironmentService environmentService;
    private final IFileEnvironmentService fileEnvironmentService;

    public EnvironmentController(IEnvironmentService environmentService, IFileEnvironmentService fileEnvironmentService) {
        this.environmentService = environmentService;
        this.fileEnvironmentService = fileEnvironmentService;
    }

    @PostMapping()
    public Response<EnvironmentDTO> createEnvironment(@Valid @RequestBody EnvironmentDTO environmentDTO) {
        System.out.println(environmentDTO);
        return this.environmentService.createEnvironment(environmentDTO);
    }
    @PostMapping("/uploadFile")
    ResponseEntity<List<String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return new ResponseEntity<>(this.fileEnvironmentService.uploadFile(file), HttpStatus.OK);
    }

    @RequestMapping(value = "/update/{id}", method = RequestMethod.PATCH, produces = "application/json")
    @ResponseBody
    public Response<EnvironmentDTO> updateEnvironment(@Valid @RequestBody EnvironmentDTO environmentDTO, @PathVariable Integer id) {
        return this.environmentService.updateEnvironment(environmentDTO, id);
    }

    @PostMapping("/addResource")
    public Response<Boolean> addResourceToEnvironment(@RequestBody ResourceList resourceList, @RequestParam Integer environmentId) {
        return this.environmentService.addResourceToEnvironment(resourceList, environmentId);
    }

    @PutMapping("/updateResource")
    public Response<Boolean> updateResourceToEnvironment(@RequestBody ResourceList resourceList, @RequestParam Integer environmentId) {
        return this.environmentService.updateResourceToEnvironment(resourceList, environmentId);
    }

    @GetMapping()
    public Response<GenericPageableResponse> findAll(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String sort, @RequestParam String order){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order),sort));
        return this.environmentService.findAll(pageable);
    }

    @GetMapping("/byResource")
    public Response<GenericPageableResponse> findAllByResourceId(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String sort, @RequestParam String order, @RequestParam Integer resourceId){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order),sort));
        return this.environmentService.findAllByResourceId(pageable, resourceId);
    }

    @GetMapping("/byFaculty")
    public Response<GenericPageableResponse> findAllByFacultyId(@RequestParam Integer page, @RequestParam Integer size, @RequestParam String sort, @RequestParam String order, @RequestParam String facultyId){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order),sort));
        return this.environmentService.findAllByFacultyId(pageable, facultyId);
    }

    @GetMapping("/byEnvironmentTypeAndParentId")
    public Response<GenericPageableResponse> findAllByEnvironmentTypeAndParentId(@RequestParam Integer page,
     @RequestParam Integer size, @RequestParam String sort, @RequestParam String order,
      @RequestParam EnvironmentTypeEnumeration environmentType, @RequestParam Integer parentId){
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(order),sort));
        return this.environmentService.findAllByEnvironmentTypeAndParentId(pageable,
        environmentType, parentId);
    }

    @GetMapping("/{id}")
    public Response<EnvironmentDTO> findById(@PathVariable Integer id){
        return this.environmentService.getEnvironmentByCode(id);
    }

    @GetMapping("/allTypes")
    public List<EnvironmentTypeEnumeration> findAllTypes(){
        return this.environmentService.findAllTypesEnvironment();
    }

    @DeleteMapping("/delete/{environmentId}")
    public void deleteEnvironment(@PathVariable Integer environmentId){
        System.out.println("id"+environmentId);
        this.environmentService.deleteById(environmentId);
    }

    //metodo para consultar todos los edificios a partir de un id facultad 
    @GetMapping("/consultBuildingsByFacultyId/{id}")
    public Response<List<EnvironmentDTO>> consultBuildingsByFacultyId(@PathVariable String id) {
        return this.environmentService.findAllBuildingsByFacultyId(id);}
 /* 
    //Esto quedo redundante, lo comento por si acaso
    @GetMapping("/consultEnvironmentsByParentId/{id}")
    public Response<List<EnvironmentDTO>> consultEnvironmentsByFacultyId(@PathVariable String id) {
        return this.environmentService.findAllEnvironmentByIdFacultyAndBuilding(id);
    } */
}
