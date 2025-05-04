// Generate sample 600 students dynamically
const branches = ['Computer', 'IT', 'Mechanical', 'Civil', 'ENTC', 'Electrical'];
const students = [];

for (let i = 1; i <= 600; i++) {
  const randomBranch = branches[Math.floor(Math.random() * branches.length)];
  const randomYear = Math.floor(Math.random() * (2024 - 2018 + 1)) + 2018;
  const randomMarks = (Math.random() * (90 - 60) + 60).toFixed(2);
  students.push({
    id: i,
    name: `Student ${i}`,
    branch: randomBranch,
    year: randomYear,
    marks: randomMarks
  });
}

let filteredStudents = [...students];
let currentPage = 1;
const recordsPerPage = 50;

const tbody = document.querySelector("#studentsTable tbody");
const pageInfo = document.getElementById('pageInfo');

// Display students with pagination
function displayStudents(data) {
  tbody.innerHTML = "";
  const start = (currentPage - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.branch}</td>
      <td>${student.year}</td>
      <td>${student.marks}</td>
    `;
    tbody.appendChild(tr);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(data.length / recordsPerPage)}`;
}

displayStudents(filteredStudents);

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', function() {
  applyFilters();
});

// Branch filter functionality
document.getElementById('branchFilter').addEventListener('change', function() {
  applyFilters();
});

// Apply both filters
function applyFilters() {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const branchValue = document.getElementById('branchFilter').value;

  filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchValue) || student.branch.toLowerCase().includes(searchValue);
    const matchesBranch = branchValue === "" || student.branch === branchValue;
    return matchesSearch && matchesBranch;
  });

  currentPage = 1; // Reset to first page
  displayStudents(filteredStudents);
}

// Sorting functionality
function sortTable(n) {
  students.sort((a, b) => {
    let valA = Object.values(a)[n];
    let valB = Object.values(b)[n];
    
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
  applyFilters();
}

// Pagination controls
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayStudents(filteredStudents);
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < Math.ceil(filteredStudents.length / recordsPerPage)) {
    currentPage++;
    displayStudents(filteredStudents);
  }
});

// Download Excel functionality
function downloadExcel() {
  const worksheet = XLSX.utils.json_to_sheet(filteredStudents);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

  XLSX.writeFile(workbook, "MITAOE_Student_Records.xlsx");
}
