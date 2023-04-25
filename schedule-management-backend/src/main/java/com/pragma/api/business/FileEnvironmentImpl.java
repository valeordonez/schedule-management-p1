package com.pragma.api.business;



import com.pragma.api.model.*;
import com.pragma.api.model.enums.EnvironmentTypeEnumeration;
import com.pragma.api.model.enums.ResourceTypeEnumeration;
import com.pragma.api.repository.IEnvironmentRepository;
import com.pragma.api.repository.IFacultyRepository;
import com.pragma.api.repository.IResourceRepository;
import com.pragma.api.util.file.FileEnvironment;
import com.pragma.api.util.file.templateclasses.FileRowEnvironment;
//import org.hibernate.mapping.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class FileEnvironmentImpl implements IFileEnvironmentService{

    //VERIFICAAAAR

    private IEnvironmentRepository environmentRepository;

    private IFacultyRepository facultyRepository;

    private IResourceRepository resourceRepository;

    @Autowired
    public FileEnvironmentImpl(IEnvironmentRepository environmentRepository, IFacultyRepository facultyRepository,
                               IResourceRepository resourceRepository) {
        this.environmentRepository = environmentRepository;
        this.facultyRepository = facultyRepository;
        this.resourceRepository= resourceRepository;
    }

    @Override
    public List<String> uploadFile(MultipartFile file) throws IOException {
        FileEnvironment fileEnvironment = new FileEnvironment();
        List<FileRowEnvironment> logs = fileEnvironment.getLogs(file);
        return processFile(logs);

    }

    @Override
    public List<String> processFile(List<FileRowEnvironment> logs) {
        List<String> infoLogs = new ArrayList<>();

        for(FileRowEnvironment log:logs){

            Faculty faculty = facultyRepository.findByFacultyIdIs(log.getFaculty().toUpperCase().trim());

            if(faculty!=null){

                Environment environment = new Environment();
                environment.setName(log.getName());
                environment.setLocation(log.getLocation());
                environment.setCapacity(log.getCapacity());
                switch (log.getEnvironmentType().toUpperCase()){
                    case "AUDITORIO":
                        environment.setEnvironmentType(EnvironmentTypeEnumeration.AUDITORIO);
                        break;
                    case "LABORATORIO":
                        environment.setEnvironmentType(EnvironmentTypeEnumeration.LABORATORIO);
                        break;
                    case "SALON":
                        environment.setEnvironmentType(EnvironmentTypeEnumeration.SALON);
                        break;
                    default:
                        environment.setEnvironmentType(EnvironmentTypeEnumeration.DEFAULT);
                        break;
                }

                List<Resource> resourcesDb = this.resourceRepository.findAll();
                Set<Resource> resources = new HashSet<>();
                String[] words = log.getAvailableResources().split(",");
                String[] wordsFormat = wordFormat(words);

                for (int i = 0; i < resourcesDb.size(); i++) {
                    if(i!=wordsFormat.length-1){
                        if(resourcesDb.get(i).getName().toUpperCase().trim().equals(wordsFormat[i])){
                            Resource resource = resourcesDb.get(i);
                            resources.add(resource);

                        }
                    }
                }

                environment.setAvailableResources(resources);
                environment.setFaculty(faculty);
                environmentRepository.save(environment);

                infoLogs.add("Course Created succesfully!");
            }else{
                infoLogs.add("Course NOT Created");
            }
        }
        return infoLogs;
    }

    private String [] wordFormat(String [] words){
        for (int i = 0; i < words.length; i++) {
            words[i] = words[i].toUpperCase().trim();
        }
        return words;
    }
}