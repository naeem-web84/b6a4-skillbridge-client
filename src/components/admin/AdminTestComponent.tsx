// components/admin/adminTestComponent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import adminService, { 
  UserFilters, 
  TutorFilters, 
  BookingFilters, 
  CategoryFilters, 
  ReviewFilters,
  UpdateUserData,
  UpdateTutorData,
  UpdateCategoryData,
  UpdateBookingData,
  UpdateReviewData,
  CreateCategoryData,
  CreateNotificationData
} from '@/services/admin/admin.service';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

const AdminTestComponent: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('all');
  const [testData, setTestData] = useState<any>(null);

  // Sample test data
  const sampleUserFilters: UserFilters = {
    page: 1,
    limit: 5,
    role: 'TUTOR',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  const sampleTutorFilters: TutorFilters = {
    page: 1,
    limit: 5,
    minRating: 4,
    sortBy: 'rating',
    sortOrder: 'desc'
  };

  const sampleBookingFilters: BookingFilters = {
    page: 1,
    limit: 5,
    status: 'PENDING',
    sortBy: 'bookingDate',
    sortOrder: 'desc'
  };

  const sampleCategoryFilters: CategoryFilters = {
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc'
  };

  const sampleReviewFilters: ReviewFilters = {
    page: 1,
    limit: 5,
    minRating: 3,
    isVerified: true,
    sortBy: 'rating',
    sortOrder: 'desc'
  };

  const sampleUpdateUserData: UpdateUserData = {
    status: 'Active',
    emailVerified: true
  };

  const sampleUpdateTutorData: UpdateTutorData = {
    hourlyRate: 50,
    experienceYears: 3
  };

  const sampleUpdateCategoryData: UpdateCategoryData = {
    name: 'Updated Category',
    description: 'Updated description'
  };

  const sampleUpdateBookingData: UpdateBookingData = {
    status: 'CONFIRMED',
    isPaid: true
  };

  const sampleUpdateReviewData: UpdateReviewData = {
    rating: 5,
    isVerified: true
  };

  const sampleCreateCategoryData: CreateCategoryData = {
    name: 'Test Category',
    description: 'This is a test category'
  };

  const sampleNotificationData: CreateNotificationData = {
    userId: 'test-user-id', // You'll need to replace with actual user ID
    title: 'Test Notification',
    message: 'This is a test notification from admin',
    type: 'SYSTEM'
  };

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    try {
      const result = await testFunction();
      return {
        name: testName,
        success: result.success || false,
        message: result.message || 'Test completed',
        data: result.data
      };
    } catch (error: any) {
      return {
        name: testName,
        success: false,
        message: error.message || 'Test failed',
        error: error
      };
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    const results: TestResult[] = [];

    // 1. USER MANAGEMENT TESTS
    console.log('🧪 Starting User Management Tests...');
    
    // Test: Get all users
    const usersResult = await runTest('Get All Users', () => 
      adminService.users.getAllUsers(sampleUserFilters)
    );
    results.push(usersResult);

    // Only run update/delete tests if we have a user
    if (usersResult.data && usersResult.data.length > 0) {
      const firstUser = usersResult.data[0];
      
      // Test: Update user
      const updateUserResult = await runTest('Update User', () => 
        adminService.users.updateUser(firstUser.id, sampleUpdateUserData)
      );
      results.push(updateUserResult);
    }

    // 2. TUTOR MANAGEMENT TESTS
    console.log('🧪 Starting Tutor Management Tests...');
    
    // Test: Get all tutors
    const tutorsResult = await runTest('Get All Tutors', () => 
      adminService.tutors.getAllTutors(sampleTutorFilters)
    );
    results.push(tutorsResult);

    // Only run update/delete tests if we have a tutor
    if (tutorsResult.data && tutorsResult.data.length > 0) {
      const firstTutor = tutorsResult.data[0];
      
      // Test: Update tutor profile
      const updateTutorResult = await runTest('Update Tutor Profile', () => 
        adminService.tutors.updateTutorProfile(firstTutor.id, sampleUpdateTutorData)
      );
      results.push(updateTutorResult);
    }

    // 3. CATEGORY MANAGEMENT TESTS
    console.log('🧪 Starting Category Management Tests...');
    
    // Test: Get all categories
    const categoriesResult = await runTest('Get All Categories', () => 
      adminService.categories.getAllCategories(sampleCategoryFilters)
    );
    results.push(categoriesResult);

    // Test: Create category
    const createCategoryResult = await runTest('Create Category', () => 
      adminService.categories.createCategory(sampleCreateCategoryData)
    );
    results.push(createCategoryResult);

    // Only run update/delete tests if we have a category
    if (categoriesResult.data && categoriesResult.data.length > 0) {
      const firstCategory = categoriesResult.data[0];
      
      // Test: Update category
      const updateCategoryResult = await runTest('Update Category', () => 
        adminService.categories.updateCategory(firstCategory.id, sampleUpdateCategoryData)
      );
      results.push(updateCategoryResult);
    }

    // 4. BOOKING MANAGEMENT TESTS
    console.log('🧪 Starting Booking Management Tests...');
    
    // Test: Get all bookings
    const bookingsResult = await runTest('Get All Bookings', () => 
      adminService.bookings.getAllBookings(sampleBookingFilters)
    );
    results.push(bookingsResult);

    // Only run update test if we have a booking
    if (bookingsResult.data && bookingsResult.data.length > 0) {
      const firstBooking = bookingsResult.data[0];
      
      // Test: Update booking
      const updateBookingResult = await runTest('Update Booking', () => 
        adminService.bookings.updateBooking(firstBooking.id, sampleUpdateBookingData)
      );
      results.push(updateBookingResult);
    }

    // 5. REVIEW MANAGEMENT TESTS
    console.log('🧪 Starting Review Management Tests...');
    
    // Test: Get all reviews
    const reviewsResult = await runTest('Get All Reviews', () => 
      adminService.reviews.getAllReviews(sampleReviewFilters)
    );
    results.push(reviewsResult);

    // Only run update/delete tests if we have a review
    if (reviewsResult.data && reviewsResult.data.length > 0) {
      const firstReview = reviewsResult.data[0];
      
      // Test: Update review
      const updateReviewResult = await runTest('Update Review', () => 
        adminService.reviews.updateReview(firstReview.id, sampleUpdateReviewData)
      );
      results.push(updateReviewResult);
    }

    // 6. PLATFORM STATISTICS TEST
    console.log('🧪 Starting Platform Statistics Test...');
    
    const statsResult = await runTest('Get Platform Statistics', () => 
      adminService.stats.getPlatformStats()
    );
    results.push(statsResult);

    // 7. NOTIFICATION MANAGEMENT TEST
    console.log('🧪 Starting Notification Management Test...');
    
    const notificationResult = await runTest('Send Notification', () => 
      adminService.notifications.sendNotification(sampleNotificationData)
    );
    results.push(notificationResult);

    setTestResults(results);
    setIsTesting(false);

    // Log summary
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`✅ Tests completed: ${passed} passed, ${failed} failed`);
  };

  const runSingleTest = async (testType: string) => {
    setIsTesting(true);
    let result: TestResult;

    switch (testType) {
      case 'users':
        result = await runTest('Get All Users', () => 
          adminService.users.getAllUsers(sampleUserFilters)
        );
        break;
      
      case 'tutors':
        result = await runTest('Get All Tutors', () => 
          adminService.tutors.getAllTutors(sampleTutorFilters)
        );
        break;
      
      case 'categories':
        result = await runTest('Get All Categories', () => 
          adminService.categories.getAllCategories(sampleCategoryFilters)
        );
        break;
      
      case 'bookings':
        result = await runTest('Get All Bookings', () => 
          adminService.bookings.getAllBookings(sampleBookingFilters)
        );
        break;
      
      case 'reviews':
        result = await runTest('Get All Reviews', () => 
          adminService.reviews.getAllReviews(sampleReviewFilters)
        );
        break;
      
      case 'stats':
        result = await runTest('Get Platform Statistics', () => 
          adminService.stats.getPlatformStats()
        );
        break;
      
      case 'notifications':
        result = await runTest('Send Notification', () => 
          adminService.notifications.sendNotification(sampleNotificationData)
        );
        break;
      
      default:
        result = {
          name: 'Invalid Test',
          success: false,
          message: 'Invalid test type selected'
        };
    }

    setTestResults([result]);
    setTestData(result.data);
    setIsTesting(false);
  };

  const handleTestRun = () => {
    if (selectedTest === 'all') {
      runAllTests();
    } else {
      runSingleTest(selectedTest);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setTestData(null);
  };

  // Calculate test statistics
  const passedTests = testResults.filter(r => r.success).length;
  const failedTests = testResults.filter(r => !r.success).length;
  const totalTests = testResults.length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin API Test Component</h1>
        <p className="text-gray-600 mb-6">Test all admin service functions and view the results</p>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test Type
              </label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tests</option>
                <option value="users">User Management</option>
                <option value="tutors">Tutor Management</option>
                <option value="categories">Category Management</option>
                <option value="bookings">Booking Management</option>
                <option value="reviews">Review Management</option>
                <option value="stats">Platform Statistics</option>
                <option value="notifications">Notification Management</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTestRun}
                disabled={isTesting}
                className={`px-6 py-2 rounded-md font-medium ${
                  isTesting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isTesting ? 'Running Tests...' : 'Run Tests'}
              </button>

              <button
                onClick={clearResults}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Test Statistics */}
          {totalTests > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">{passedTests}</div>
                <div className="text-sm text-green-600">Tests Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-700">{failedTests}</div>
                <div className="text-sm text-red-600">Tests Failed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{totalTests}</div>
                <div className="text-sm text-blue-600">Total Tests</div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                result.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {result.success ? '✓ PASS' : '✗ FAIL'}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800">{result.name}</h3>
                  </div>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700">{result.message}</p>
                </div>

                {result.error && (
                  <div className="mb-3 p-3 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-red-700 font-medium mb-1">Error Details:</p>
                    <pre className="text-xs text-red-600 overflow-auto">
                      {JSON.stringify(result.error, null, 2)}
                    </pre>
                  </div>
                )}

                {result.data && (
                  <div className="mt-3">
                    <button
                      onClick={() => setTestData(result.data)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {testData === result.data ? '▼ Hide Data' : '▶ Show Data'}
                    </button>

                    {testData === result.data && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm text-gray-700 font-medium mb-2">Response Data:</p>
                        <pre className="text-xs text-gray-600 overflow-auto max-h-96">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {testResults.length === 0 && !isTesting && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Test Results Yet</h3>
            <p className="text-gray-500 mb-4">
              Select a test type and click "Run Tests" to start testing the admin APIs
            </p>
          </div>
        )}

        {/* Testing Indicator */}
        {isTesting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Running Tests</h3>
                <p className="text-gray-600 text-center">
                  Testing admin service functions...
                  <br />
                  <span className="text-sm">This may take a moment</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">API Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Base URL:</p>
              <code className="text-sm bg-blue-100 px-2 py-1 rounded">/api/admin</code>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Endpoints:</p>
              <code className="text-sm bg-blue-100 px-2 py-1 rounded">17 endpoints</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestComponent;