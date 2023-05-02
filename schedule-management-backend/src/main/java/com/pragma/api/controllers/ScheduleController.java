package com.pragma.api.controllers;

import com.pragma.api.services.IScheduleService;
import com.pragma.api.domain.ScheduleRequestDTO;
import com.pragma.api.domain.ScheduleResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/schedule")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ScheduleController {

    private final IScheduleService scheduleService;

    public ScheduleController(IScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }
    @PostMapping
    public ResponseEntity<ScheduleResponseDTO> saveSchedule(@Valid @RequestBody ScheduleRequestDTO scheduleRequest) {
        return ResponseEntity.ok(this.scheduleService.saveSchedule(scheduleRequest));
    }

    @GetMapping
    public ResponseEntity<List<ScheduleResponseDTO>> getAllByEnvironment(@RequestParam Integer environmentId) {
        return ResponseEntity.ok(this.scheduleService.getAllByEnvironment(environmentId));
    }

//    @GetMapping("/byTeacher")
//    public ResponseEntity<List<ScheduleResponseDTO>> getAllByTeacher(@RequestParam String teacherCode) {
//        return ResponseEntity.ok(this.scheduleService.getAllByTeacher(teacherCode));
//    }

    @PutMapping
    public ResponseEntity<ScheduleResponseDTO> updateSchedule(@RequestParam Long scheduleId, @Valid @RequestBody ScheduleRequestDTO scheduleRequest) {
        return ResponseEntity.ok(this.scheduleService.updateSchedule(scheduleId, scheduleRequest));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteSchedule(@RequestParam Long scheduleId) {
        this.scheduleService.deleteSchedule(scheduleId);
        return ResponseEntity.ok("Schedule was deleted successful!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponseDTO> findById(@PathVariable Long id){
        return ResponseEntity.ok(this.scheduleService.getScheduleById(id));
    }

}