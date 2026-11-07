import React, { useState } from 'react';
import { 
  AppRole, 
  StudentTab, 
  UserProfile, 
  Course, 
  ChatMessage, 
  PaymentTransaction, 
  DeviceChangeRequest, 
  ModerationReport, 
  AuditLogEntry,
  MentorProfile,
  MentorVideo,
  MembershipPlan
} from './types';
import { 
  INITIAL_USER, 
  COURSES, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_PAYMENTS_QUEUE, 
  INITIAL_DEVICE_REQUESTS, 
  INITIAL_MODERATION_REPORTS, 
  INITIAL_AUDIT_LOGS,
  INITIAL_MENTORS,
  INITIAL_MENTOR_VIDEOS
} from './data/mockData';

import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { LegalDisclaimer } from './components/common/LegalDisclaimer';

import { StudentHome } from './components/student/StudentHome';
import { VideoPlayerView } from './components/student/VideoPlayerView';
import { MyLearningView } from './components/student/MyLearningView';
import { CourseCatalogView } from './components/student/CourseCatalogView';
import { CommunityChatView } from './components/student/CommunityChatView';
import { TradingDiscussionsView } from './components/discussions/TradingDiscussionsView';
import { SettingsPaymentView } from './components/student/SettingsPaymentView';
import { StudentProfileView } from './components/student/StudentProfileView';
import { MembershipPlansView } from './components/student/MembershipPlansView';
import { MentorVideoCatalogView } from './components/mentors/MentorVideoCatalogView';
import { MentorVideoUploadDashboard } from './components/mentors/MentorVideoUploadDashboard';
import { CheckoutModal } from './components/student/CheckoutModal';
import { DeviceChangeModal } from './components/student/DeviceChangeModal';

import { AdminPortal } from './components/admin/AdminPortal';
import { Bell, Check, X, ShieldAlert, Smartphone } from 'lucide-react';

export default function App() {
  // App Role: 'student' vs 'mentor' vs Admin roles ('owner_admin', 'moderator', 'payments_admin')
  const [currentRole, setCurrentRole] = useState<AppRole>('student');
  const [activeStudentTab, setActiveStudentTab] = useState<StudentTab>('home');

  // Application Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [paymentsQueue, setPaymentsQueue] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS_QUEUE);
  const [deviceRequests, setDeviceRequests] = useState<DeviceChangeRequest[]>(INITIAL_DEVICE_REQUESTS);
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Modals & Player State
  const [activePlayerCourseId, setActivePlayerCourseId] = useState<string | null>(null);
  const [activePlayerLessonId, setActivePlayerLessonId] = useState<string | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [checkoutMembershipPlan, setCheckoutMembershipPlan] = useState<MembershipPlan | null>(null);
  const [showDeviceChangeModal, setShowDeviceChangeModal] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mentors and Mentor Video Library States
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [mentorVideos, setMentorVideos] = useState<MentorVideo[]>(INITIAL_MENTOR_VIDEOS);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Lesson Player
  const handleOpenPlayer = (courseId: string, lessonId: string) => {
    setActivePlayerCourseId(courseId);
    setActivePlayerLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Lesson Completion
  const handleToggleCompleteLesson = (lessonId: string) => {
    setUser(prev => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const updated = exists 
        ? prev.completedLessonIds.filter(id => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      
      showToast(exists ? 'Lesson marked incomplete' : 'Lesson marked complete! Progress updated (+4.2%).');
      return {
        ...prev,
        completedLessonIds: updated
      };
    });
  };

  // Handle Enrollment Success
  const handleEnrollSuccess = (courseId: string) => {
    setUser(prev => ({
      ...prev,
      enrolledCourseIds: prev.enrolledCourseIds.includes(courseId) 
        ? prev.enrolledCourseIds 
        : [...prev.enrolledCourseIds, courseId]
    }));
    showToast('Congratulations! Course enrolled and verified. Access unlocked.');
  };

  // Update Payment Details (Section 38)
  const handleUpdatePaymentDetails = (gpay: string, binance: string) => {
    setUser(prev => ({
      ...prev,
      paymentDetails: {
        gpayUpiId: gpay,
        binanceUid: binance,
        lastUpdated: 'Just now'
      }
    }));

    // Record in Audit Log
    const newLog: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actor: user.name,
      actorRole: 'student',
      action: 'PAYMENT_DETAILS_UPDATED',
      target: `GPay: ${gpay} | Binance: ${binance}`,
      details: 'Student updated settlement payment identifiers from Settings / Payment details.',
      ipAddress: user.registeredDevice.ipAddress,
      severity: 'medium'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    showToast('Payment details saved securely to account.');
  };

  // Submit Device Change Request
  const handleSubmitDeviceChange = (reason: string, newDeviceModel: string) => {
    const newReq: DeviceChangeRequest = {
      id: `dreq_${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      requestedAt: 'Just now',
      reason,
      oldDevice: { ...user.registeredDevice },
      newDevice: {
        id: `DEV-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
        deviceName: newDeviceModel,
        model: newDeviceModel,
        os: 'Android / iOS',
        browser: 'Browser 124.0',
        ipAddress: '103.21.124.95',
        location: 'Chennai, India',
        lastActive: 'Requested',
        isCurrent: false,
        status: 'pending_review'
      },
      status: 'pending'
    };

    setDeviceRequests(prev => [newReq, ...prev]);

    // Record in Audit Log
    const newLog: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actor: user.name,
      actorRole: 'student',
      action: 'DEVICE_MIGRATION_REQUESTED',
      target: `${user.registeredDevice.deviceName} -> ${newDeviceModel}`,
      details: `Hardware migration hold active for 24 hours. Reason: ${reason}`,
      ipAddress: user.registeredDevice.ipAddress,
      severity: 'medium'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    showToast('Migration request submitted. 24-hour verification hold initiated.');
  };

  // Admin Payment Verification
  const handleVerifyPayment = (paymentId: string) => {
    setPaymentsQueue(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'verified',
          verifiedBy: `${currentRole.replace('_', ' ')} (${new Date().toLocaleDateString()})`
        };
      }
      return p;
    }));

    const verifiedPayment = paymentsQueue.find(p => p.id === paymentId);
    if (verifiedPayment) {
      // If Arun Kumar's payment, ensure enrolled
      if (verifiedPayment.studentId === user.id) {
        handleEnrollSuccess(verifiedPayment.courseId);
      }

      // Add to audit trail
      const auditItem: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: 'Just now',
        actor: currentRole.toUpperCase(),
        actorRole: currentRole,
        action: 'PAYMENT_VERIFIED',
        target: `${verifiedPayment.orderRef} (₹${verifiedPayment.amount})`,
        details: `Settlement verified for student ${verifiedPayment.studentName}. Access granted.`,
        ipAddress: '182.72.19.45',
        severity: 'high'
      };
      setAuditLogs(prev => [auditItem, ...prev]);
    }
    showToast('Payment verified successfully. Student access confirmed.');
  };

  // Admin Device Approval
  const handleApproveDevice = (requestId: string) => {
    const req = deviceRequests.find(d => d.id === requestId);
    if (req) {
      if (req.studentId === user.id) {
        setUser(prev => ({
          ...prev,
          registeredDevice: {
            ...req.newDevice,
            status: 'active',
            isCurrent: true
          }
        }));
      }

      setDeviceRequests(prev => prev.filter(d => d.id !== requestId));

      const auditItem: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: 'Just now',
        actor: currentRole.toUpperCase(),
        actorRole: currentRole,
        action: 'DEVICE_MIGRATION_APPROVED',
        target: `${req.studentName} (${req.newDevice.deviceName})`,
        details: `Approved device reassignment. Revoked previous hardware token ${req.oldDevice.id}.`,
        ipAddress: '182.72.19.45',
        severity: 'high'
      };
      setAuditLogs(prev => [auditItem, ...prev]);
      showToast('Device change approved. Old hardware token revoked.');
    }
  };

  const handleRejectDevice = (requestId: string) => {
    setDeviceRequests(prev => prev.filter(d => d.id !== requestId));
    showToast('Device change request declined.');
  };

  // Admin Moderation Action
  const handleResolveReport = (reportId: string, action: 'mute' | 'delete' | 'dismiss') => {
    setReports(prev => prev.filter(r => r.id !== reportId));

    const auditItem: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: 'Just now',
      actor: currentRole.toUpperCase(),
      actorRole: currentRole,
      action: `REPORT_${action.toUpperCase()}`,
      target: `Report #${reportId}`,
      details: `Moderator executed ${action} action on reported content.`,
      ipAddress: '182.72.19.45',
      severity: 'medium'
    };
    setAuditLogs(prev => [auditItem, ...prev]);
    showToast(`Report ${action} completed.`);
  };

  // Find player course and lesson
  const playerCourse = courses.find(c => c.id === activePlayerCourseId);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F2F4F8] flex flex-col font-sans selection:bg-[#E5A82B]/30 selection:text-white">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeStudentTab={activeStudentTab}
        onSelectStudentTab={(tab) => {
          setActiveStudentTab(tab);
          setActivePlayerCourseId(null);
        }}
        user={user}
        unreadChatCount={1}
        onOpenNotifications={() => setShowNotificationsDrawer(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Responsive Sidebar (Desktop & Tablet) - hidden in admin view */}
        {currentRole === 'student' && !activePlayerCourseId && (
          <Sidebar
            activeTab={activeStudentTab}
            onSelectTab={(tab) => {
              setActiveStudentTab(tab);
              setActivePlayerCourseId(null);
            }}
            unreadMentorshipCount={1}
            isEnrolledInSMC={user.enrolledCourseIds.includes('course_smc_foundations')}
          />
        )}

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-10 w-full min-w-0">
          {/* TOAST FEEDBACK NOTIFICATION */}
          {toastMessage && (
            <div className="fixed top-16 right-4 z-50 bg-[#1A2133] border border-[#E5A82B] text-xs font-semibold text-[#F2F4F8] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
              <Check className="w-4 h-4 text-[#3DDC97]" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* MENTOR VIDEO DASHBOARD VIEW */}
          {currentRole === 'mentor' ? (
            <MentorVideoUploadDashboard
              currentMentor={mentors.find(m => m.id === 'mentor_rahul') || mentors[0]}
              videos={mentorVideos}
              onUploadVideo={(videoData) => {
                const isDraft = videoData.status === 'draft';
                const newVideo: MentorVideo = {
                  id: `mv_${Date.now()}`,
                  title: videoData.title || 'Untitled SMC Lesson',
                  description: videoData.description || '',
                  mentorId: 'mentor_rahul',
                  mentorName: 'Rahul (Institutional SMC Lead)',
                  mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                  mentorSpecialization: 'Smart Money Concepts & Order Blocks',
                  category: videoData.category || 'SMC Concepts',
                  thumbnailUrl: videoData.thumbnailUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
                  videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                  durationSeconds: videoData.durationSeconds || 720,
                  tags: videoData.tags || ['SMC', 'OrderBlock'],
                  instruments: videoData.instruments || ['US30', 'XAUUSD'],
                  status: videoData.status || 'published',
                  uploadedAt: 'Just now',
                  views: 0,
                  likes: 0,
                  likedByUser: false,
                  isBookmarked: false,
                  commentsCount: 0,
                  comments: []
                };
                setMentorVideos(prev => [newVideo, ...prev]);
                showToast(isDraft ? 'Video saved as draft.' : 'Video published to library!');
              }}
              onEditVideo={(updatedVideo: MentorVideo) => {
                setMentorVideos(prev => prev.map(v => v.id === updatedVideo.id ? updatedVideo : v));
                showToast('Video updated successfully.');
              }}
              onDeleteVideo={(videoId: string) => {
                setMentorVideos(prev => prev.filter(v => v.id !== videoId));
                showToast('Video removed.');
              }}
            />
          ) : currentRole !== 'student' ? (
            <AdminPortal
              currentRole={currentRole}
              onRoleChange={setCurrentRole}
              payments={paymentsQueue}
              onVerifyPayment={handleVerifyPayment}
              deviceRequests={deviceRequests}
              onApproveDevice={handleApproveDevice}
              onRejectDevice={handleRejectDevice}
              reports={reports}
              onResolveReport={handleResolveReport}
              auditLogs={auditLogs}
              courses={courses}
              onBackToStudent={() => setCurrentRole('student')}
            />
          ) : activePlayerCourseId && playerCourse ? (
            /* VIDEO PLAYER VIEW */
            <VideoPlayerView
              course={playerCourse}
              initialLessonId={activePlayerLessonId || playerCourse.lessons[0].id}
              completedLessonIds={user.completedLessonIds}
              onToggleCompleteLesson={handleToggleCompleteLesson}
              onBackToCourse={() => setActivePlayerCourseId(null)}
              onSelectLesson={(lId) => setActivePlayerLessonId(lId)}
            />
          ) : (
            /* STUDENT TAB VIEWS */
            <>
              {activeStudentTab === 'home' && (
                <StudentHome
                  user={user}
                  courses={courses}
                  onSelectTab={setActiveStudentTab}
                  onOpenPlayer={handleOpenPlayer}
                  onEnrollCourse={(c) => setCheckoutCourse(c)}
                />
              )}

              {activeStudentTab === 'learning' && (
                <MyLearningView
                  user={user}
                  courses={courses}
                  onOpenPlayer={handleOpenPlayer}
                  onExploreCourses={() => setActiveStudentTab('catalog')}
                />
              )}

              {activeStudentTab === 'catalog' && (
                <CourseCatalogView
                  courses={courses}
                  user={user}
                  onEnroll={(c) => setCheckoutCourse(c)}
                  onOpenPlayer={handleOpenPlayer}
                />
              )}

              {activeStudentTab === 'mentor_videos' && (
                <MentorVideoCatalogView
                  user={user}
                  currentRole={currentRole}
                  videos={mentorVideos}
                  mentors={mentors}
                  onLikeVideo={(videoId: string) => {
                    setMentorVideos(prev => prev.map(v => {
                      if (v.id === videoId) {
                        const isLiked = Boolean(v.likedByUser);
                        return {
                          ...v,
                          likedByUser: !isLiked,
                          likes: isLiked ? Math.max(0, v.likes - 1) : v.likes + 1
                        };
                      }
                      return v;
                    }));
                  }}
                  onBookmarkVideo={(videoId: string) => {
                    setMentorVideos(prev => prev.map(v => {
                      if (v.id === videoId) {
                        return {
                          ...v,
                          isBookmarked: !v.isBookmarked
                        };
                      }
                      return v;
                    }));
                    showToast('Bookmark toggled.');
                  }}
                  onAddComment={(videoId: string, content: string, replyToCommentId?: string, replyToAuthorName?: string) => {
                    const newComm = {
                      id: `comm_${Date.now()}`,
                      videoId,
                      authorId: user.id,
                      authorName: user.name,
                      authorAvatar: user.avatarUrl,
                      authorBadge: 'Student',
                      content,
                      createdAt: 'Just now',
                      likes: 0,
                      replyToCommentId,
                      replyToAuthorName
                    };
                    setMentorVideos(prev => prev.map(v => {
                      if (v.id === videoId) {
                        const comms = [...(v.comments || []), newComm];
                        return {
                          ...v,
                          comments: comms,
                          commentsCount: comms.length
                        };
                      }
                      return v;
                    }));
                    showToast('Comment submitted.');
                  }}
                  onOpenUploadDashboard={() => setCurrentRole('mentor')}
                />
              )}

              {activeStudentTab === 'membership' && (
                <MembershipPlansView
                  user={user}
                  onSelectPlanToCheckout={(plan: MembershipPlan) => setCheckoutMembershipPlan(plan)}
                />
              )}

              {activeStudentTab === 'community' && (
                <TradingDiscussionsView
                  user={user}
                  currentRole={currentRole}
                  onOpenMentorshipChat={() => setActiveStudentTab('mentorship')}
                />
              )}

              {activeStudentTab === 'mentorship' && (
                <CommunityChatView
                  user={user}
                  initialMessages={chatMessages}
                  defaultRoom="mentorship"
                />
              )}

              {(activeStudentTab === 'payment_details' || activeStudentTab === 'device_security') && (
                <SettingsPaymentView
                  user={user}
                  onUpdatePaymentDetails={handleUpdatePaymentDetails}
                  onRequestDeviceChange={() => setShowDeviceChangeModal(true)}
                />
              )}

              {activeStudentTab === 'profile' && (
                <StudentProfileView
                  user={user}
                  onSelectTab={setActiveStudentTab}
                  onRequestDeviceChange={() => setShowDeviceChangeModal(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation (68px height, 44px touch targets) */}
      {currentRole === 'student' && !activePlayerCourseId && (
        <BottomNav
          activeTab={activeStudentTab}
          onSelectTab={(tab) => {
            setActiveStudentTab(tab);
            setActivePlayerCourseId(null);
          }}
          unreadCount={1}
        />
      )}

      {/* SEBI Statutory Disclaimer & Educational Footer */}
      {!activePlayerCourseId && <LegalDisclaimer />}

      {/* CHECKOUT MODAL (4-step enrollment flow with coupons) */}
      {(checkoutCourse || checkoutMembershipPlan) && (
        <CheckoutModal
          course={checkoutCourse}
          membershipPlan={checkoutMembershipPlan}
          user={user}
          onClose={() => {
            setCheckoutCourse(null);
            setCheckoutMembershipPlan(null);
          }}
          onEnrollSuccess={(itemId, itemType) => {
            if (itemType === 'course') {
              handleEnrollSuccess(itemId);
              setCheckoutCourse(null);
              handleOpenPlayer(itemId, courses.find(c => c.id === itemId)?.lessons[0].id || 'lesson_f1');
            } else {
              setCheckoutMembershipPlan(null);
              showToast('Membership plan activated! Institutional trading access unlocked.');
            }
          }}
        />
      )}

      {/* DEVICE CHANGE MODAL */}
      {showDeviceChangeModal && (
        <DeviceChangeModal
          currentDevice={user.registeredDevice}
          onClose={() => setShowDeviceChangeModal(false)}
          onSubmitRequest={handleSubmitDeviceChange}
        />
      )}

      {/* NOTIFICATIONS SLIDE-OVER DRAWER */}
      {showNotificationsDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-[#1A2133] border-l border-[#26304A] h-full p-5 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#26304A]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#E5A82B]" />
                  <h3 className="text-sm font-bold text-[#F2F4F8]">Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotificationsDrawer(false)}
                  className="text-[#9AA6BD] hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[#0F1522] rounded-xl border border-[#E5A82B]/30 space-y-1">
                  <div className="flex items-center justify-between text-[#E5A82B] font-bold">
                    <span>Mentor Rahul Replied</span>
                    <span className="text-[10px] text-[#9AA6BD]">10:02 AM</span>
                  </div>
                  <p className="text-[#9AA6BD] text-[11px]">
                    "Notice however that the candle directly preceding the displacement left an unfilled FVG..."
                  </p>
                  <button
                    onClick={() => {
                      setShowNotificationsDrawer(false);
                      setActiveStudentTab('mentorship');
                    }}
                    className="text-[#E5A82B] text-[11px] font-bold hover:underline pt-1 block"
                  >
                    Open Mentorship Chat →
                  </button>
                </div>

                <div className="p-3 bg-[#0F1522] rounded-xl border border-[#26304A] space-y-1">
                  <div className="flex items-center justify-between text-[#3DDC97] font-bold">
                    <span>Device Security Heartbeat</span>
                    <span className="text-[10px] text-[#9AA6BD]">Today</span>
                  </div>
                  <p className="text-[#9AA6BD] text-[11px]">
                    Samsung Galaxy A54 confirmed as single active authorized hardware device.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1522] rounded-xl border border-[#26304A] space-y-1">
                  <div className="flex items-center justify-between text-[#8FB0FF] font-bold">
                    <span>Live Doubt Session Alert</span>
                    <span className="text-[10px] text-[#9AA6BD]">Sat 7PM</span>
                  </div>
                  <p className="text-[#9AA6BD] text-[11px]">
                    Weekly institutional market breakdown with Rahul on Zoom & live community room.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#26304A] text-center">
              <button
                onClick={() => setShowNotificationsDrawer(false)}
                className="w-full py-2 rounded-xl bg-[#212B42] text-xs font-semibold text-[#F2F4F8] hover:bg-[#26304A]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
