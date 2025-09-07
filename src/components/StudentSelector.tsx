import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { User, GraduationCap } from 'lucide-react';

interface Student {
  id: number;
  full_name: string;
  email: string;
}

interface StudentSelectorProps {
  selectedStudentId: number | null;
  onStudentChange: (studentId: number, studentName: string) => void;
  students: Student[];
  loading?: boolean;
}

export function StudentSelector({ selectedStudentId, onStudentChange, students, loading }: StudentSelectorProps) {
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <Card className="bg-gray-100 dark:bg-gray-800/90 backdrop-blur-md border-gray-200 dark:border-white/20 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <User className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-purple-800 dark:text-purple-200">Student Identity:</span>
          </div>
          
          <div className="flex-1 max-w-md">
            <Select 
              value={selectedStudentId?.toString() || ""} 
              onValueChange={(value) => {
                const studentId = parseInt(value);
                const student = students.find(s => s.id === studentId);
                if (student) {
                  onStudentChange(studentId, student.full_name);
                }
              }}
            >
              <SelectTrigger className="bg-white/10 border-blue-400 text-white hover:bg-white/20 transition-colors focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                <SelectValue placeholder={loading ? "Loading students..." : "Select who you are..."} className="placeholder:text-purple-200" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="font-medium text-gray-900">{student.full_name}</div>
                        <div className="text-sm text-purple-600">{student.email}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStudent && (
            <div className="bg-purple-600/30 border border-purple-500/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 text-purple-100">
                <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                <span className="text-sm font-medium">Logged in as {selectedStudent.full_name}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
